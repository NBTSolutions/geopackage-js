var GeoPackage = require('../../../lib/geoPackage').default
  , GeoPackageConnection = require('../../../lib/db/geoPackageConnection').connect
  , GeoPackageTileRetriever = require('../../../lib/tiles/retriever').default;

var path = require('path')
  , should = require('chai').should();

describe('Tests for issue 68', function() {

  it('should get a tile', function() {
    this.timeout(5000);
    return GeoPackageConnection(path.join(__dirname, '..', '..', 'fixtures', 'issue_68.gpkg'))
    .then(function(geoPackageConnection) {
      var connection = geoPackageConnection;
      should.exist(connection);
      var geoPackage = new GeoPackage('', '', connection);
      var tables = geoPackage.getTileTables();
      tables[0].should.be.equal('package_tiles');
      var tileDao = geoPackage.getTileDao('package_tiles');
      should.exist(tileDao);
      var info = geoPackage.getInfoForTable(tileDao);
      var gpr = new GeoPackageTileRetriever(tileDao, 256, 256);
      return gpr.getTile(192,401,10)
      .then(function(tile) {
        should.exist(tile);
        geoPackage.close();
      });
    });
  });

});
