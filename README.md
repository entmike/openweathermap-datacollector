# openweathermap-datacollector
Collect data from Open Weather Map and store in PostrgreSQL DB

[![GitHub issues](https://img.shields.io/github/issues/entmike/openweathermap-datacollector.svg)](https://github.com/entmike/openweathermap-datacollector/issues)
[![Docker Pulls](https://img.shields.io/docker/pulls/entmike/openweathermap-datacollector.svg)](https://hub.docker.com/r/entmike/openweathermap-datacollector/)
[![Automated Build](https://img.shields.io/docker/cloud/automated/entmike/openweathermap-datacollector.svg)](https://hub.docker.com/r/entmike/openweathermap-datacollector/)

Pull weather data from NOAA and populate a PostgreSQL DB table

# Try it Now with Docker
If you don't care about local development and just want to run it, see the example below.

## Pre-requisites:

1. Docker Installed
2. PostgreSQL Installed somewhere (physical host, VM, Docker, whatever) with a new DB created (i.e. `hubitat`)
3. OpenWeatherMap [API Key](https://openweathermap.org/api)
3. `temp` table created in PostgreSQL DB.  Create statement for your convenience:
```sql
CREATE TABLE temp (
    temp double precision,
    feels_like double precision,
    temp_min double precision,
    temp_max double precision,
    pressure double precision,
    humidity double precision,
    timestamp timestamp without time zone DEFAULT now(),
    units character varying(25),
    latitude double precision,
    longitude double precision
);
```

## Example:
```
docker run --rm -ti \
  -e PGHOST=yourpostgreshost -e PGPORT=5432 -e PGDATABASE=hubitat -e PGUSER=postgres -e PGPASSWORD=YourPassword \
  -e INTERVAL=300 -e LATITUDE=40.70098574912939 -e LONGITUDE=-73.9837906003035 -e APIKEY=youropenweathermapapikey entmike/openweathermap-datacollector
```

Environment Variables:
|Variable|Description|Default Value|
|---|---|---|
|`PGHOST`|PostgreSQL Host|Empty|
|`PGPORT`|PostgreSQL Port|`5432`|
|`PGDATABASE`|PostgreSQL Database Name|Empty|
|`PGUSER`|PostgreSQL User|Empty|
|`PGPASSWORD`|PostgreSQL Password|Empty|
|`INTERVAL`|OpenWeatherMap Refresh Interval (seconds)|`300`|
|`LATITUDE`|Latitude of where you want forecast|`40.70098574912939`|
|`LONGITUDE`|Longitude of where you want forecast|`-73.9837906003035`|
|`APIKEY`|Your OpenWeatherMap API Key|Empty|

In `psql` or whatever PostgreSQL client you use, connect to the database and look at the `forecast` table for updates.
