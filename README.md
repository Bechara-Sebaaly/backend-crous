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

##### 📄 api

contains all the interfaces that describes the structure of the data that the opendatasoft API is returning (format JSON). The data structure can be shown bellow:

```
ApiData
├── nhits (number of hits)
├── parameters
│ ├── dataset (the dataset from where the data is read)
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

##### 🪪 crous.interface

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

##### 🧩 expanded-crous.dto

this contains the expanded version of the crous data (all the attributs existing in the interface), to be used when requesting info about a single crous

##### 🧩 reduced-crous.dto

this contains the reduced version of the crous data (certain attributs from the interface), to be used when requesting info about multiple crous restaurants (so probably for the thumbnails)
