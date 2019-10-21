CREATE TABLE accounts(
   id serial not null primary key,
   username text not null,
   password text not null,
   email text UNIQUE not null,
   last_login timestamp
);

create table waiters(
    id serial not null primary key,
    waiter_username text not null,
    weekdays_working text,
	waiters_id int,
	foreign key (waiters_id) references accounts(id)
);

create table info(
	id serial not null primary key,
	weekday text not null,
    waiters_for_day int not null
);