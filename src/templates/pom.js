module.exports = function(config) {
   return `
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/xsd/maven-4.0.0.xsd">
    <modelVersion>4.0.0</modelVersion>

    <parent>
        <groupId>com.stratio</groupId>
        <artifactId>parent</artifactId>
        <version>0.9.0</version>
    </parent>

    <groupId>${config.packageId}</groupId>
    <artifactId>acceptance-tests</artifactId>
    <version>0.1.0-SNAPSHOT</version>
    <name>acceptance-tests</name>

    <properties>
        <bdt.version>0.6.0-SNAPSHOT</bdt.version>
        <project.build.sourceEncoding>UTF-8</project.build.sourceEncoding>
        <project.reporting.outputEncoding>UTF-8</project.reporting.outputEncoding>
        <scala.version>2.11</scala.version>
        <scala.binary.version>\${scala.version}.8</scala.binary.version>
        <scalacheck.version>1.12.5</scalacheck.version>
        <com.stratio.governance.model.version>0.3.0</com.stratio.governance.model.version>
    </properties>

    <build>
        <plugins>
            <plugin>
                <groupId>org.apache.maven.plugins</groupId>
                <artifactId>maven-compiler-plugin</artifactId>
                <configuration>
                    <source>1.7</source>
                    <target>1.7</target>
                </configuration>
            </plugin>
            <plugin>
                <groupId>org.apache.maven.plugins</groupId>
                <artifactId>maven-surefire-plugin</artifactId>
                <configuration>
                    <skipTests>true</skipTests>
                </configuration>
            </plugin>
            <plugin>
                <groupId>org.apache.maven.plugins</groupId>
                <artifactId>maven-failsafe-plugin</artifactId>
                <configuration>
                    <properties>
                        <property>
                            <name>usedefaultlisteners</name>
                            <value>false</value>
                        </property>
                        <property>
                            <name>listener</name>
                            <value>com.stratio.qa.utils.JaCoCoClient</value>
                        </property>
                    </properties>
                    <argLine>-Xmx1024m
                        -javaagent:\${settings.localRepository}/org/aspectj/aspectjweaver/1.8.8/aspectjweaver-1.8.8.jar</argLine>
                    <useSystemClassloader>true</useSystemClassloader>
                </configuration>
            </plugin>
        </plugins>
    </build>

    <dependencies>
        <dependency>
            <groupId>org.scala-lang</groupId>
            <artifactId>scala-library</artifactId>
            <version>\${scala.binary.version}</version>
        </dependency>
        <dependency>
            <groupId>com.stratio.qa</groupId>
            <artifactId>bdt</artifactId>
            <version>\${bdt.version}</version>
        </dependency>
        <dependency>
            <groupId>org.apache.logging.log4j</groupId>
            <artifactId>log4j-slf4j-impl</artifactId>
            <version>2.0</version>
        </dependency>
        <dependency>
            <groupId>org.apache.logging.log4j</groupId>
            <artifactId>log4j-core</artifactId>
            <version>2.0</version>
        </dependency>
        <dependency>
            <groupId>org.apache.logging.log4j</groupId>
            <artifactId>log4j-1.2-api</artifactId>
            <version>2.0</version>
        </dependency>
        <dependency>
            <groupId>org.testng</groupId>
            <artifactId>testng</artifactId>
            <version>6.9.9</version>
        </dependency>
        <dependency>
            <groupId>org.postgresql</groupId>
            <artifactId>postgresql</artifactId>
            <version>42.1.1</version>
        </dependency>
        <dependency>
            <groupId>org.scalacheck</groupId>
            <artifactId>scalacheck_\${scala.version}</artifactId>
            <version>\${scalacheck.version}</version>
            <scope>test</scope>
        </dependency>
    </dependencies>

</project>
`;
};
