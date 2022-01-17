create user board@172.17.0.1;

create schema board;

create table board.board (
  id int primary key auto_increment,
  title varchar(255) not null,
  tags varchar(255) not null,
  content text not null,
  created_at timestamp default current_timestamp,
  views int default 0
);

create table board.comments (
  id int primary key auto_increment,
  board_id int not null,
  reply_id int default 0,
  content text not null,
  author varchar(255) not null,
  created_at timestamp default current_timestamp,
  foreign key (board_id) references board.board(id)
);

grant all on board.* to board@172.17.0.1;
