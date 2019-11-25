[![Build Status](https://travis-ci.org/WNortier/waiter-availability-with-express.svg?branch=master)](https://travis-ci.org/WNortier/waiter-availability-with-express)

## Background 
Your sister is running a coffee shop in town, she needs a web application to help her schedule weekly waiter shifts.
Create a web application that can help her.

Waiters can:

- select days they can work
- update the days they can work on

Your sister wants to:

- see how many waiters are available to work
- reset the data to use the system for a new week

She needs 3 waiters for each day. Days for which there are enough waiters should be marked as green, days for which more waiters are needed still and days that are over subscribed should be highlighted accordingly.

## Usage
When you are testing the app:

You will need to create 3 waiter accounts to get workdays to show up green on the manager side, because I prevent the same waiter from selecting the same workday twice.  I.e. each separate waiter will need to select Monday three times after logging in.  Similarly, you will need a 4th account to make the blocks show up red by adding another Monday entry using the fourth account.  

In order to access the manager view you will need to create an account "admin@gmail.com"