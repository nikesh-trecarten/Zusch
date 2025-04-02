SELECT box_id, location, 
       ST_Distance(location, ST_GeographyFromText('SRID=4326;POINT(7.090452 50.73288)')) AS distance_meters
FROM boxes
ORDER BY distance_meters ASC
LIMIT 20;