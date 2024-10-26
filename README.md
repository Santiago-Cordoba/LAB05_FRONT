# LABORATORIO5 - CI/CD
# Creando los Pipelines (CI - Continous Integration)

En este laboratorio, realizamos la configuracion de un workflow(conjunto de pasos automatizados que se usan para realizar tareas especificas) que contiene 3 jobs principales: build, test y deploy. El workflow se activara mediante un evento denominado on pull_request. 

### Funcionalidad Jobs 

- **Job:Build**: Compila los archivos de codigo fuente del proyecto usando "mvn compile".
- **Job:Test**: Realiza la fase de verificacion de Maven con "verify", requiere que el job anterior (Build) se haya completado exitosamente, ya que no se puede ejecutar "mvn verify" sin que haya compilado primero.     
   **¿Se puede lograr que se ejecute sin necesidad de compilar el proyecto?**
      No es posible, es imprescindible haber completado la fase de compilacion, ya que Maven sigue un flujo de trabajo especifico y determinado. 
- **Job:Deploy**: Realiza el proceso de despliegue, haciendo enfasis en que los dos jobs anteriores se hayan ejectutado correctamente, haciendo que se desplieguen versiones que hayan pasado las pruebas. 

### Configuración del Workflow

```yaml
name: Build and Test Java Spring Boot Application

on:
  push:
    branches: [ "main", "develop" ]
  pull_request:
    branches: [ "main", "develop" ]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Set up JDK 21
        uses: actions/setup-java@v4
        with:
          java-version: '21'
          distribution: 'temurin'
          cache: maven

      - name: Build with Maven
        run: mvn clean compile -X

  test:
    needs: build
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Set up JDK 21
        uses: actions/setup-java@v4
        with:
          java-version: '21'
          distribution: 'temurin'
          cache: maven

      - name: Test with Maven
        run: mvn -f pom.xml clean verify

      - name: Test Report with Jacoco
        uses: actions/upload-artifact@v4
        if: success() || failure()
        with:
          name: SpringBoot Report            
          path: target/site/jacoco/         

  deploy:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Set up JDK 21
        uses: actions/setup-java@v4
        with:
          java-version: '21'
          distribution: 'temurin'
          cache: maven

      - name: Build and Package with Maven
        run: mvn clean package -DskipTests

      - name: Deploy to Azure Web App
        uses: azure/webapps-deploy@v2
        with:
          app-name: 'AppTareas'
          publish-profile: ${{ secrets.AZURE_WEBAPP_PUBLISH_PROFILE }}
          package: './target/AppTareas-0.0.1-SNAPSHOT.jar' 
```

## Nuevos Tests: 

### 1. Dado que tengo 1 tarea registrada, Cuando lo consulto a nivel de servicio, Entonces la consulta será exitosa validando el campo id.

```
@Test
    void dadoUnaTareaRegistrada_CuandoLaConsulto_EntoncesLaConsultaEsExitosaYValidaElId() {
        // Creamos una nueva tarea 
        Tarea tarea = new Tarea("1", "Test Task", "Descripción", false, 2, "Bajo", 6);

        // Configurar el mock para que retorne la tarea cuando se consulta por su ID
        when(tareaPersistence.findById("1")).thenReturn(Optional.of(tarea));

        // Ejecutar el método de servicio
        Tarea tareaConsultada = tareaService.obtenerTarea("1");

        // Validar que el ID es correcto
        assertEquals("1", tareaConsultada.getId());
        verify(tareaPersistence, times(1)).findById("1");
    }
```
### 2. Dado que no hay ninguna tarea registrada, Cuándo la consulto a nivel de servicio, Entonces la consulta no retornará ningún resultado.
```
@Test
    void dadoNoHayTareasRegistradas_CuandoLaConsulto_EntoncesNoRetornaraResultado() {
        // Configurar el mock para que no retorne ninguna tarea
        when(tareaPersistence.findById("999")).thenReturn(Optional.empty());

        // Verificar que se lanza una excepción al consultar un ID inexistente
        assertThrows(IllegalArgumentException.class, () -> {
            tareaService.obtenerTarea("999");
        });

        verify(tareaPersistence, times(1)).findById("999");
    }
```

### 3.Dado que no hay ninguna tarea registrada, Cuándo lo creo a nivel de servicio, Entonces la creación será exitosa.
```
@Test
    void dadoNoHayTareasRegistradas_CuandoCreoUnaTarea_EntoncesLaCreacionEsExitosa() {
        // Crear una tarea de prueba
        Tarea tarea = new Tarea(null, "Nueva Tarea", "Descripción", false, 3, "Bajo", 9);
        Tarea tareaConId = new Tarea("generated-id", "Nueva Tarea", "Descripción", false, 4, "Medio", 12);

        // Configurar el mock para que guarde la tarea y retorne una con ID generado
        when(tareaPersistence.save(any(Tarea.class))).thenReturn(tareaConId);

        // Ejecutar el método de servicio
        Tarea tareaCreada = tareaService.crear(tarea);

        // Validar que se ha generado un ID y que la tarea fue guardada correctamente
        assertNotNull(tareaCreada.getId());
        verify(tareaPersistence, times(1)).save(any(Tarea.class));
    }
```
### 4.Dado que tengo 1 tarea registrada, Cuándo la elimino a nivel de servicio, Entonces la eliminación será exitosa.
```
@Test
    void dadoUnaTareaRegistrada_CuandoLaElimino_EntoncesLaEliminacionEsExitosa() {
        // Crear una tarea de prueba
        Tarea tarea = new Tarea("2", "Tarea a eliminar", "Descripción", false, 1, "Bajo", 2.2);

        // Configurar el mock para que retorne la tarea cuando se consulte por ID
        when(tareaPersistence.findById("2")).thenReturn(Optional.of(tarea));

        // Ejecutar la eliminación
        tareaService.eliminarTarea("2");

        // Verificar que se llamó a eliminar en el repositorio
        verify(tareaPersistence, times(1)).deleteById("2");
    }

```
### 5.Dado que tengo 1 tarea registrada, Cuándo la elimino y consulto a nivel de servicio, Entonces el resultado de la consulta no retornará ningún resultado.
```
@Test
    void dadoUnaTareaRegistrada_CuandoLaEliminoYLaConsulto_EntoncesNoRetornaResultado() {
        // Crear una tarea de prueba
        Tarea tarea = new Tarea("3", "Otra Tarea a eliminar", "Descripción", false, 3, "Medio", 5.5);

        // Configurar el mock para que retorne la tarea cuando se consulte por ID antes de eliminarla
        when(tareaPersistence.findById("3")).thenReturn(Optional.of(tarea)).thenReturn(Optional.empty());

        // Ejecutar la eliminación
        tareaService.eliminarTarea("3");

        // Verificar que la tarea ha sido eliminada y no puede ser consultada
        assertThrows(IllegalArgumentException.class, () -> {
            tareaService.obtenerTarea("3");
        });

        // Verificar las interacciones
        verify(tareaPersistence, times(2)).findById("3");  // Se llama para eliminar y consultar
        verify(tareaPersistence, times(1)).deleteById("3"); // Se llama para eliminar la tarea
    }
```
# Desplegando en Azure usando CI/CD (Continous Deployment / Continous Delivery)

### 1. Creacion App Web en Azure. 

![CreacionRecursoAzure](https://github.com/user-attachments/assets/babc911b-029f-4825-95b6-ad44750ed3ff)

### 2. App web ya establecida. 

![TerminoCreacion](https://github.com/user-attachments/assets/3b3e2c9b-698d-40f8-944b-367aca52376e)

### 3. Aparicion ventana que nos indica las herramientas necesarias para poder hacer el despliegue de la aplicacion

<img width="931" alt="imagen2" src="https://github.com/user-attachments/assets/1b20ff65-0102-458d-bcee-b55eccd17f51">

### 4. Creacion Recurso SQL

![imagen](https://github.com/user-attachments/assets/cce316f6-425b-4a6f-9f33-4c668f4c7c73)

### 5. La aplicacion no deberia funcionar por falta de configuraciones

![error](https://github.com/user-attachments/assets/918d468f-2f31-4581-bc60-8ea5b71e13f6)

### 6. Cambio en application.properties para la implementacion de SQL. 

```
spring.application.name=AppTareas
server.port=80
spring.data.mongodb.uri=mongodb+srv://coronado:coronado@cluster0.llgr8.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0
spring.data.mongodb.database=proyecto
tarea.persistence=mongoDB

spring.datasource.url=jdbc:mysql://tareas.mysql.database.azure.com:3306/tareas?useSSL=true
spring.datasource.username=admin1
spring.datasource.password=Root123!
spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
```

# PARTE II. GRÁFICOS

En esta sección de gráficos de nuestro laboratorio, decidimos utilizar Chart.js debido a su facilidad de implementación y versatilidad. Esta biblioteca nos permite crear gráficos animados y personalizables a partir de datos generados proceduralmente, lo que es ideal para nuestro proyecto, donde no se necesita una interfaz gráfica para introducir datos.

Entre las ventajas que encontramos, destacan su simplicidad y rendimiento, incluso con un gran volumen de datos. Además, proporciona diferentes tipos de gráficos, como barras y líneas, que son útiles para representar las métricas que necesitamos visualizar, como el histograma de dificultad y los promedios de tareas por prioridad.


#### Obtener tareas o datos.
![obtenerTareas](https://github.com/user-attachments/assets/d1d5f8d7-984e-4eee-a7c1-085429882e48)

#### Mostrar la grafica.
![representarGrafica](https://github.com/user-attachments/assets/60736799-35a4-41ce-9598-d028fdc07fe8)

### Histograma dificultad.
![histogramaDificultad](https://github.com/user-attachments/assets/ca14b310-9295-435e-8663-0dc94df35cf6)
![histogramaD2](https://github.com/user-attachments/assets/bf575846-1df0-4f0b-95a1-270fc82852eb)

#### Grafica

![histoDif ](https://github.com/user-attachments/assets/53c795fd-8441-4139-b973-b8e6d623d096)

#### Tareas finalizadas por cantidad de tiempo.
![tareaFin](https://github.com/user-attachments/assets/601dfda0-5783-42b6-984c-2dc0264a849a)
![fin2](https://github.com/user-attachments/assets/fad55260-69f6-4d04-8f16-6cfb073637d3)

#### Grafica

![tareasend](https://github.com/user-attachments/assets/dd634574-9922-4cfb-ab3a-9afb34d8e35e)

#### Promedios por prioridad. 
![priori](https://github.com/user-attachments/assets/a5e0b763-6460-4f52-9ae8-3626b1e5181d)
![priori2](https://github.com/user-attachments/assets/19078366-3f2f-43ee-bd03-cd34748ea872)

#### Grafica

![promedDif](https://github.com/user-attachments/assets/76f44783-5c85-4a4d-865e-47a86eb40958)

#### Tiempo invertido según dificultad. 
![tiempo](https://github.com/user-attachments/assets/52da71a5-99de-48f5-a4de-18e594f9fef7)
![tiempo2](https://github.com/user-attachments/assets/5d096138-16f3-43d3-b3a7-7e63189685ef)

#### Grafica

![tiempInv](https://github.com/user-attachments/assets/7a470c8e-fe0b-427a-9df1-15a14d3ae707)
