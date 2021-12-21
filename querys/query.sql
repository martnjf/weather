/* Creation of Database */
create database Procesos;
go

use Procesos;
go
/* Selects */
select @@SERVERNAME

select * from TB_BI_CSL_RegistroTemperaturaXidOdicina;

DELETE FROM TB_BI_CSL_RegistroTemperaturaXidOdicina;

/* Database */

IF OBJECT_ID ('TB_BI_CSL_RegistroTemperaturaXidOdicina') IS NOT NULL
DROP TABLE TB_BI_CSL_RegistroTemperaturaXidOdicina
GO

CREATE TABLE TB_BI_CSL_RegistroTemperaturaXidOdicina
(
IdReg INT IDENTITY NOT NULL
, IdOficina SMALLINT
, Humedad SMALLINT
, Nubes SMALLINT
, Sensacion FLOAT
, Temperatura FLOAT
, Descripcion VARCHAR(200)
, FechaCreacion DATETIME DEFAULT (getdate())
)
GO

CREATE UNIQUE NONCLUSTERED INDEX IX_1_TB_BI_CSL_RegistroTemperaturaXidOdicina ON TB_BI_CSL_RegistroTemperaturaXidOdicina (IdOficina,IdReg)
GO

CREATE PROCEDURE USP_BI_CSL_insert_reg_RegistroTemperaturaXidOdicina
(
@IdOficina SMALLINT
, @Humedad SMALLINT
, @Nubes SMALLINT
, @Sensacion FLOAT
, @Temperatura FLOAT
, @Descripcion VARCHAR(200)
)
AS
BEGIN
INSERT INTO TB_BI_CSL_RegistroTemperaturaXidOdicina
VALUES (
@IdOficina
, @Humedad
, @Nubes
, @Sensacion
, @Temperatura
, UPPER(@Descripcion)
, GETDATE()
)
END
GO

EXEC USP_BI_CSL_insert_reg_RegistroTemperaturaXidOdicina 3,52,95,19.88,20.42,'Nubes'
