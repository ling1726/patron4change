# curl -i \
#   -d '{ "text": "Dieser Text wird zernichtet und zerbrochen", "explain": "true", "analyzer": "german" }' \
#   http://localhost:9200/_analyze

# curl -i \
#   -d '{ "query": { "bool": { "should": { "match_phrase": { "mission": "Schuler" } } } } }' \
#   http://localhost:9200/profile_v1/changemaker/_search

# curl -i \
#   http://localhost:9200/profile_v1/_analysis

# curl -i \
#   http://localhost:9200/_all

# curl -i \
#   http://localhost:9200/profile_v2/changemaker/_search

curl -i -X GET \
  http://localhost:3001/search/changemaker?q=Projektätigkeiten
