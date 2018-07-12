var GeoPackageAPI = require('../../../..')
  , GeometryColumnsDao = require('../../../../lib/features/columns').GeometryColumnsDao
  , GeoPackageConnection = require('../../../../lib/db/geoPackageConnection')
  , TestUtils = require('../../../fixtures/testUtils')
  , should = require('chai').should()
  , path = require('path');

describe('GeometryColumns tests', function() {

  var db;
  var connection;

  beforeEach('should open the geopackage', function(done) {
    GeoPackageConnection.connect(path.join(__dirname, '..', '..', '..', 'fixtures', 'gdal_sample.gpkg')).then(function(geoPackageConnection) {
      connection = geoPackageConnection;
      should.exist(connection);
      done();
    });
  });

  afterEach('should close the geopackage', function() {
    connection.close();
  });

  it('should get the feature tables', function(done) {
    var gcd = new GeometryColumnsDao(connection);
    gcd.getFeatureTables(function(err, tables) {
      should.not.exist(err);
      should.exist(tables);
      tables.length.should.be.equal(16);
      tables.should.have.members([
        'point2d',
         'linestring2d',
         'polygon2d',
         'multipoint2d',
         'multilinestring2d',
         'multipolygon2d',
         'geomcollection2d',
         'geometry2d',
         'point3d',
         'linestring3d',
         'polygon3d',
         'multipoint3d',
         'multilinestring3d',
         'multipolygon3d',
         'geomcollection3d',
         'geometry3d'
      ]);
      done();
    });
  });

  it('should get the table', function(done) {
    var gcd = new GeometryColumnsDao(connection);
    gcd.queryForTableName('point2d', function(err, table) {
      should.not.exist(err);
      should.exist(table);
      TestUtils.compareProperties(table, {
        column_name: 'geom',
        table_name: 'point2d',
        geometry_type_name: 'POINT',
        srs_id: 0,
        z: 0,
        m: 0
      });
      done();
    });
  });

  it('should get no table', function(done) {
    var gcd = new GeometryColumnsDao(connection);
    gcd.queryForTableName('doesnotexist', function(err, table) {
      should.not.exist(err);
      should.not.exist(table);
      done();
    });
  });

  it('should get all the tables', function(done){
    var gcd = new GeometryColumnsDao(connection);
    gcd.queryForAll(function(err, results) {
      should.not.exist(err);
      should.exist(results);
      results.should.have.property('length', 16);
      done();
    });
  });

  it('should get the table', function(done) {
    var gcd = new GeometryColumnsDao(connection);
    gcd.queryForTableName('point2d', function(err, table) {
      should.not.exist(err);
      should.exist(table);
      TestUtils.compareProperties(table, {
        table_name: 'point2d',
        column_name: 'geom',
        geometry_type_name: 'POINT',
        srs_id: 0,
        z: 0,
        m: 0
      });
      done();
    });
  });

  it('should get the srs from the table', function(done) {
    var gcd = new GeometryColumnsDao(connection);
    gcd.queryForTableName('point2d', function(err, table) {
      should.not.exist(err);
      should.exist(table);
      TestUtils.compareProperties(table, {
        table_name: 'point2d',
        column_name: 'geom',
        geometry_type_name: 'POINT',
        srs_id: 0,
        z: 0,
        m: 0
      });
      var srs = gcd.getSrs(table);
      TestUtils.compareProperties(srs, {
        srs_name: 'Undefined geographic SRS',
        srs_id: 0,
        organization: 'NONE',
        organization_coordsys_id: 0,
        definition: 'undefined',
        description: 'undefined geographic coordinate reference system'
      });
      done();
    });
  });

  it('should get the contents from the table', function(done) {
    var gcd = new GeometryColumnsDao(connection);
    gcd.queryForTableName('point2d', function(err, table) {
      should.not.exist(err);
      should.exist(table);
      TestUtils.compareProperties(table, {
        table_name: 'point2d',
        column_name: 'geom',
        geometry_type_name: 'POINT',
        srs_id: 0,
        z: 0,
        m: 0
      });
      var contents = gcd.getContents(table);
      contents.should.be.deep.equal({
        table_name: 'point2d',
        data_type: 'features',
        identifier: 'point2d',
        description: '',
        last_change: '2014-08-27T15:36:41.000Z',
        min_x: 1,
        min_y: 2,
        max_x: 1,
        max_y: 2,
        srs_id: 0
      });
      done();
    });
  });

  it('should get the projection from the table', function(done) {
    var gcd = new GeometryColumnsDao(connection);
    gcd.queryForTableName('point2d', function(err, table) {
      should.not.exist(err);
      should.exist(table);
      TestUtils.compareProperties(table, {
        table_name: 'point2d',
        column_name: 'geom',
        geometry_type_name: 'POINT',
        srs_id: 0,
        z: 0,
        m: 0
      });
      var projection = gcd.getProjection(table);
      should.exist(projection);
      done();
    });
  });

});
