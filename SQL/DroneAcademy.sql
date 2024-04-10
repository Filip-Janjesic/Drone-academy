
 --Priprema za produkciju
 --Ovo za produkciju ne treba
--use master;
--go
--drop database if exists droneacademy;
--go
--create database droneacademy;
--go
--alter database droneacademy collate Croatian_CI_AS;
--go
--use droneacademy;

---- Ovo za produkciju treba
--SELECT name, collation_name FROM sys.databases;
--GO
---- Doma primjeniti na ime svoje baze 3 puta
--ALTER DATABASE db_aa7767_filipjanjesic1 SET SINGLE_USER WITH
--ROLLBACK IMMEDIATE;
--GO
--ALTER DATABASE db_aa7767_filipjanjesic1 COLLATE Croatian_CI_AS;
--GO
--ALTER DATABASE db_aa7767_filipjanjesic1 SET MULTI_USER;
--GO
--SELECT name, collation_name FROM sys.databases;
--GO

create table operateri(
sifra int not null primary key identity(1,1),
email varchar(50) not null,
lozinka varchar(200) not null
);

-- Lozinka droneacademy generirana pomoću https://bcrypt-generator.com/
insert into operateri values ('droneacademy@droneacademy.hr',
'$2a$12$u9OiBM0twMXEwIm29KWSieOBGX7Ea.feXKBOBKZI2g.L/VhW3LJSa');



create table tecajevi(
sifra int not null primary key identity(1,1),
naziv varchar(60) not null,
brojsati int,
cijena decimal(18,2),
upisnina decimal(18,2),
verificiran bit
);


create table grupe(
sifra int not null primary key identity(1,1),
naziv varchar(50) not null,
pilot int,
tecaj int not null,
maksimalnokandidata int,
datumpocetka datetime
);


create table piloti(
sifra int not null primary key identity(1,1),
ime varchar(50) not null,
prezime varchar(50) not null,
oib char(11),
email varchar(100) not null,
iban varchar(50)
);


create table kandidati(
sifra int not null primary key identity(1,1),
ime varchar(50) not null,
prezime varchar(50) not null,
oib char(11),
email varchar(100) not null,
brojugovora varchar(20)
);

create table clanovi(
grupa int not null,
kandidat int not null
);


create table oznake(
sifra int not null primary key identity(1,1),
naziv varchar(50) not null
);

create table tecajevioznake(
sifra int not null primary key identity(1,1),
tecaj int not null,
oznaka int not null,
napomena varchar(50)
);

alter table grupe add foreign key (tecaj) references tecajevi(sifra);
alter table grupe add foreign key (pilot) references piloti(sifra);
alter table clanovi add foreign key (grupa) references grupe(sifra);
alter table clanovi add foreign key (kandidat) references kandidati(sifra);
alter table tecajevioznake add foreign key (tecaj) references tecajevi(sifra);
alter table tecajevioznake add foreign key (oznaka) references oznake(sifra);
-- 1
insert into tecajevi (naziv,brojsati,cijena,upisnina,verificiran)
values ('Infracrveni temeljni tečaj',225,1325.85,null,1);
insert into tecajevi (naziv) values
-- 2
('Majstorska klasa kinematografije dronom'),
-- 3
('Uvodna obuka letenja');

insert into piloti (ime,prezime,email) values
-- 1
('Filip','Janješić','filip.janjesic@gmail.com'),
-- 2
('Shaquille', 'O''Neal','shaki.oneal@gmail.com');



insert into kandidati (prezime,ime,email) values
('Božić','Petra','bozic.petra35@gmail.com'),
('Farkaš','Dominik','sinisartf13@gmail.com'),
('Glavaš','Natalija','natalija-glavas@hotmail.com'),
('Janić','Miroslav','miroslav.janic@gmail.com'),
('Janješić','Filip','filip.janjesic@gmail.com'),
('Jović','Nataša','natasajovic238@gmail.com'),
('Barić','Luka','lukabaric15@gmail.com'),
('Kelava','Antonio','kelava.antonio392@gmail.com'),
('Kešinović','Marijan','kesinovic957@gmail.com'),
('Leninger','Ivan','ileninger@live.com'),
('Macanga','Antonio','macanga.antonio@gmail.com'),
('Miloloža','Antonio','milolozaantonio@yahoo.com'),
('Pavković','Matija','matijapavkovic74@gmail.com'),
('Peterfaj','Karlo','karlo.peterfaj@gmail.com'),
('Plečaš','Adriana','adriana.plecas@gmail.com'),
('Senčić','Ivan','ivan.sencic2000@gmail.com'),
('Šuler','Zvonimir','zvonimir.suler@gmail.com'),
('Turček','Mario','mario.turcek@gmail.com'),
('Veseli','Domagoj','dveseli555@gmail.com'),
('Vuković','Kristijan','alanford700@gmail.com'),
('Vukušić','Ivan','ivukusic27@gmail.com'),
('Žarić','Roman','roman.zaric@gmail.com'),
('Pavlović','Ivan','ipavlovic6437@gmail.com'),
('Županić','Andrea','andrea.zupanic10@gmail.com'),
('Županić','Tomislav','tomislav.zupanic333@gmail.com'),
('Petak','Martina','petak.martina@gmail.com'),
('Perak','Marko','markoperak469@gmail.com'),
('Mokriš','Bartol','bartol567@gmail.com'),
('Jularić','Ljubomir','ljubojularic93@gmail.com'),
('Ćelić','Ivor','ivorcelic@gmail.com');



insert into grupe (naziv,tecaj,datumpocetka,maksimalnokandidata,pilot) values
-- 1
('ITT',1,'2024-04-24 17:00:00',15,1),
-- 2
('MKKD',1,'2024-10-30 17:00:00',30,2),
-- 3
('UOL',2,'2024-04-24 19:00:00',10,null);


insert into clanovi (grupa,kandidat) values
(2,1),(2,2),(2,3),(2,4),(2,5),(2,6),(2,7),
(2,8),(2,9),(2,10),(2,11),(2,12),(2,13),(2,14),
(2,15),(2,16),(2,17),(2,18),(2,19),(2,20),(2,21),
(2,22),(2,23),(2,24),(2,25),(2,26),(2,27),(2,28),
(2,29),(2,30);

insert into clanovi (grupa,kandidat) values
(1,5),(1,10),(1,12),(1,13),(1,27),(1,30);

insert into clanovi (grupa,kandidat) values
(3,5),(3,10),(3,12),(3,13);


