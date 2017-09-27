var Twitter = require('twitter');
 //user based authentication
var client = new Twitter({
  consumer_key: 'MHZQQqNGZqre9EF2axP2xRT65',
  consumer_secret: '9CeVjmM9AeDQ9bJBj0liTyYGDRyDkCNKEs6IXu0TL4OYEAZDvl',
  access_token_key: '90101497-KaYqzaxyMaVx5PqRugev7tOPb2h5ZlYafsRApGUbT',
  access_token_secret: 'lF672RkvUmwDnLrGm7jemzbHqxkSdnsxRDEXSphhVuVOJ'
});
 
var params = {screen_name: 'nodejs'};
client.get('statuses/user_timeline', params, function(error, tweets, response) {
  if (!error) {
    console.log(tweets);
  }
});





//Add your credentials accordingly. I would use environment variables to keep your private info safe. So something like:

var client = new Twitter({
  consumer_key: process.env.TWITTER_CONSUMER_KEY,
  consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
  access_token_key: process.env.TWITTER_ACCESS_TOKEN_KEY,
  access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET
});