
/*
 * GET home page.
 */

exports.index = function(req, res){
  res.render('index', { title: 'Index' })
};

exports.performer = function(req, res){
  res.render('performer', { title: 'Performer' })
};

exports.spectator = function(req, res){
  res.render('spectator', { title: 'Spectator' })
};