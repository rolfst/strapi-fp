# Strapi plugin challenges

This plugin contains the Challenges and reactions for the business challenge
Here we describe the api and object model of both the challenge and reactions

## General

we have the following suffixes for fields we want to limit

- Not suffix or eq: Equals
- ne: Not equals
- lt: Lower than
- gt: Greater than
- lte: Lower than or equal to
- gte: Greater than or equal to
- in: Included in an array of values
- nin: Isn't included in an array of values
- contains: Contains
- ncontains: Doesn't contain
- containss: Contains case sensitive
- ncontainss: Doesn't contain case sensitive
- null: Is null/Is not null

### params

| param   | type   | description                                              | example                                                                                                              |
| ------- | ------ | -------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------- |
| \_start | number | the starting point where we want to page from            | `_start=51` will return reactions with an offset of 51                                                               |
| \_limit | number | limits the amount of reactions                           | `_limit=2` will return only 2 items                                                                                  |
| \_sort  | string | the field we want to sort on                             | `_sort=title:ASC` will sort on title ascending                                                                       |
| fields  | string | comma seperated list of fields we want to display or not | `fields=title,description` will return both the title and description. `fields=-title` **will not** return the title |

## Challenge

### API

### model

## Reaction

### API

`GET /challenge/:challenge__slug/reactions` - returns all toplevel reactions for that challenge where challenge\_\_slug is provided

`POST /challenge/:challenge__slug/reactions` - creates a new reaction on a challenge

`POST /challenge/:challenge__slug/reactions/:reaction_slug` - creates a new reaction on a previous reaction

`PUT /challenge/:challenge__slug/reactions/:reaction_slug` - updates a reaction

#### params

| param | type   | description                                                                                             | example                                                                                           |
| ----- | ------ | ------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------- |
| depth | number | the level of reactions we want to fetch. We can use several suffixes on depth to fetch multiple levels. | `depth_gt=1&depth_lt=4` will fetch every reaction that has a depth greater than 1 and less than 4 |

### model
