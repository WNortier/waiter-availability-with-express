CREATE TABLE accounts(
   id serial not null PRIMARY KEY,
   username VARCHAR (50) NOT NULL,
   password VARCHAR (50) NOT NULL,
   email VARCHAR (355) UNIQUE NOT NULL,
   created_on TIMESTAMP NOT NULL,
);

create table waiters(
    id serial not null primary key,
    waiter_username text not null,
    weekdays_working text
);

create table managersInfo(
	id serial not null primary key,
	weekday text not null,
    waiters_for_day int not null
);



create table towns(
	id serial not null primary key,
	town_name text not null,
	start_string text not null
);

create table numbers(
	id serial not null primary key,
	town_number int not null,
	town_id int,
	foreign key (town_id) references towns(id)
);

create table famousPlaces(
	id serial not null primary key,
	famous_place text,
	famous_id int,
	foreign key (famous_id) references numbers(town_id)
)