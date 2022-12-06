# ⚒️ CROUS BACKEND

The following is a description of all the functionalities that are already coded and available in this API. Whenever a BASE_URL is used, it should be replaced by the http://hostingServerIP:portNumber. In case of local usage/testing, replace it with http://localhost:portNumber

To know more details about each request, please refer to the postman-collections folder where all the possible requests are available with all the data that should be sent with each request. For the Patch requests, you can ommit some attributes from the body, only change what's needed.
Go to postman -> file -> import -> upload Files and choose the collection provided in this repos to add it to postman.

## 🗒️ NOTA BENE

The data we are using is present here : https://data.opendatasoft.com/explore/dataset/fr_crous_restauration_france_entiere%40mesr/table/
The crous API can do the sorting and pagination, but we didn't use it for that. We only used the opendatasoft API to get all the data during the backend startup (on Module initialisation).
The code required for pagination and sorting of the data was created by us for this project.
Also the original form of the available data is grouping the phone number, email and address in one field called "contact". During the initial reading of the data we seperated thos into three seperate fields: phone number, address and email.
Also some entries have missing data, when the data is missing we replaced it with empty string ("")
the index.ts file in the dto folder is only there to make exporting more clean (instead of exporting from multiple files we export every thing from one file)
All adding and updating data operations are happening locally, so each time we reload the API, all the operations that you have done (adding/deleting) will be reverted.

## 🧪 testing

For testings, we have created e2e tests for the crous ressource (crous.e2e.spec.ts), we have also created a postman collection that contains all the possible requests. Tests on postman are easier for the eye, since we can always clearly see the returned value, but e2e test are important during coding in order to check if we are on the right track.

## 🚀 ressources

each ressource has a:
dto (data transfer object) folder that contains all the dto and interfaces for the ressource. These dto are used to control how the data is received ans sent from the API.
controller file, which contains all the gateways that can be used to access the data related to the ressource.
service file, which contains all the logic for the ressource, this is where reading, filtering, sorting, adding and deleting data is happening.
module file, where the metadata for each ressource are stored (imports, exports, providers, controller). providers are the services of the module.

This is a simple project, only have one ressource.

### 🍉 crous

This ressource represents all the crous restaurants in france that the opendatasoft API can provide data about.

#### 🗃️ dto

#### 📁 api

contains all the interfaces that describes the structure of the data that the opendatasoft API is returning (format JSON). The data structure can be shown bellow:

```
ApiData
├── nhits (number of hits)
├── parameters
│ └── dataset (the dataset from where the data is read)
│ └── rows (number of rows)
│ └── start (start of the page)
│ └── format (JSON)
│ └── timezone (UTC)
├── records
│ ├── datasetid (the dataset id from where the data is read)
│ └── recordid (id of the record)
│ └── fields (start of the page)
│ -----└── id (id of the crous)
│ -----└── type (type of the crous)
│ -----└── infos (description of the crous)
│ -----└── geolocalisation (latitude, longitude)
│ -----└── short_desc (short description of the crous)
│ -----└── zone (zone of the crous)
│ -----└── title (name of the crous)
│ -----└── lat (latitude)
│ -----└── closing (not speciefied, will be used to indicate if the crous is open 24/7 or not)
│ -----└── photo (url of the photo)
│ -----└── contact (address + phone number + email)
│ └── record_timestamp (time of creation of the record)
│ └── geometry
│ -----└── type (Point)
│ -----└── coordinates (latitude, longitude)
```

We are only intereseted in the fields part of the returned data.

#### 📄 crous.interface

defines the format of the crous data that we will be working with. the format is show below:

| Property    |                  Description                  |   Type |
| :---------- | :-------------------------------------------: | -----: |
| id          |                id of the crous                | string |
| type        |               type of the crous               | string |
| zone        |               zone of the crous               | string |
| title       |               name of the crous               | string |
| shortDesc   |       short description about the crous       | string |
| address     |             address of the crous              | string |
| phoneNumber |           phoneNumber of the crous            | string |
| email       |              email of the crous               | string |
| latitude    |             latitude of the crous             | number |
| longitude   |            longitude of the crous             | number |
| info        |         full description of the crous         | string |
| closing     |       if the crous closes or not (24/7)       | number |
| photoURL    | URL of the photo on the internet of the crous | string |

#### 📄 expanded-crous.dto

this contains the expanded version of the crous data (all the attributs existing in the interface), to be used when requesting info about a single crous

#### 📄 reduced-crous.dto

this contains the reduced version of the crous data (certain attributs from the interface), to be used when requesting info about multiple crous restaurants (so probably for the thumbnails)

#### 🎮 controller

| Function         | URL                                     | Description                                                                                                                   |         URL Query |
| :--------------- | :-------------------------------------- | :---------------------------------------------------------------------------------------------------------------------------- | ----------------: |
| findAll          | (GET) BASE_URL/crous                    | Returns all crous restaurants (or a page)                                                                                     | yes ( check (1) ) |
| findOneById      | (GET) BASE_URL/crous?\*\*\*id\*\*\*     | Returns one crous restaurant (where the crous id = url parameter id)                                                          |                no |
| searchByTitle    | (POST) BASE_URL/crous/search/title      | Returns one crous (where the crous title = request body title). Request Body only contains a title attribute                  |                no |
| create           | (POST) BASE_URL/crous                   | creates a new crous restaurant if a similar crous doesn't already exist or the id is not used by other crous                  |                no |
| update           | (PATCH) BASE_URL/crous/\*\*\*:id\*\*\*  | Updates the data of one crous (where the crous id = url parameters id). The update is local, doesn't affect opendatasoft data |                no |
| remove           | (DELETE) BASE_URL/crous/\*\*\*:id\*\*\* | deletes one crous (local)                                                                                                     |                no |
| toggleFavorite   | (PUT) BASE_URL/crous/\*\*\*:id\*\*\*    | either adds or removes a crous restaurant from the favorites lists                                                            |                no |

(1) page number (for pagination), number of rows (for pagination), offset (for pagination), sortBy (title,address or type), fav (0 or 1 to decide if API should return favorites or all)

#### 🔧 service

| Function                 |                                                      description                                                       |                                   arguments                                    |                                                                                       return |
| :----------------------- | :--------------------------------------------------------------------------------------------------------------------: | :----------------------------------------------------------------------------: | -------------------------------------------------------------------------------------------: |
| onModuleInit             |                  Runs automatically when the Module is initiated, used to read the opendatasoft data                   |                                       -                                        |                                                                                            - |
| create                   |        create a new crous restaurant (locally) if no similar one exists, or the is not used by other restaurant        |                                  crous: Crous                                  |                                       the added crous (ExpandedCrous) or BadRequestException |
| findAll                  |    either returns paginated/all crous restaurants or paginated/all favorites. Data is returned in its reduced form     | page: number, rows: number, offset: number, sortBy: string, favorites: number, | current, next, last and first page, number of rows, restaurants (numbers and ReducedCrousDto |
| findOneById              |                     returns crous (expanded) having the requested id or throws a NotFoundException                     |                                   id: string                                   |                                                        ExpandedCrousDto or NotFoundException |
| searchByName             |             returns crous (expanded) that its name contains the sent string or throws a NotFoundException              |                                 title: string                                  |                                  ExpandedCrousDto[] or ExpandedCrousDto or NotFoundException |
| toggleFavorite           |                 either adds or removes a crous restaurant id to/from the favorites lists (list of id)                  |                                   id: string                                   |                                                                                    id string |
| update                   |        updates the data of a crous restaurant (locally), no need to send all the data, just the ones to change         |                        id: string, updatedCrous: Crous                         |                                                         updated Crous or BadRequestException |
| remove                   |                               deletes a crous from the crousList (locally) if it exists                                |                                   id: string                                   |                                                                                  id (string) |
| getIndexOf               |                     returns the index of the crous having the same id as the one sent by argument                      |                                   id: string                                   |                                                                               index (number) |
| getCrousData             |         reads the data and format it to match the Crous interface, also stores the data in a crousList object          |                                       -                                        |                                                                           Promise<CrousList> |
| extractContacts          | extracts the phone number, enmail and address from the initial contacts field and separates them in 3 different fields |                                contact: string                                 |                                                      [address, email, phoneNumber] (strings) |
| getPaginationArguments   |          does the pagination calculations (check code for formulas), and returns the required pagination info          |          page: number, rows: number, offset: number, length: number,           |                                     [start, end, current, next, last, first, rows] (numbers) |
| sortCrousByTitle         |                                     returns the crous restaurants sorted by title                                      |                         crousList: ExpandedCrousDto[]                          |                                                sorted crous restaurants (ExpandedCrousDto[]) |
| sortCrousByAddress       |                                    returns the crous restaurants sorted by address                                     |                         crousList: ExpandedCrousDto[],                         |                                                sorted crous restaurants (ExpandedCrousDto[]) |
| sortCrousByType          |                                      returns the crous restaurants sorted by type                                      |                         crousList: ExpandedCrousDto[],                         |                                                sorted crous restaurants (ExpandedCrousDto[]) |
| reduceData               |                                transforms the expanded crous data to reduced data type                                 |                        expandedData: ExpandedCrousDto[]                        |                                           reduced data crous restaurants (ReducedCrousDto[]) |
