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
3. `temps` table created in PostgreSQL DB.  Create statement for your convenience:
```sql
CREATE TABLE temps (
    timestamp timestamp without time zone DEFAULT now(),
    units character varying(25),
    latitude double precision,
    longitude double precision,
    visibility double precision,
    name character varying(255),
    main_temp double precision,
    main_feels_like double precision,
    main_temp_min double precision,
    main_temp_max double precision,
    main_pressure double precision,
    main_humidity double precision,
    main_sea_level double precision,
    main_grnd_level double precision,
    wind_speed double precision,
    wind_deg double precision,
    wind_gust double precision,
    clouds_all double precision,
    rain_1h double precision,
    rain_3h double precision,
    snow_1h double precision,
    snow_3h double precision,
    weather_id integer,
    weather_main character varying(1024),
    weather_description character varying(1024),
    weather_icon character varying(32)
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
|`LATITUDE`|Latitude of where you want temperature|`40.70098574912939`|
|`LONGITUDE`|Longitude of where you want temperature|`-73.9837906003035`|
|`APIKEY`|Your OpenWeatherMap API Key|Empty|

In `psql` or whatever PostgreSQL client you use, connect to the database and look at the `temps` table for updates.
