let BUILD, VERSION, app, client, dbg, debug, er, opts, rtcConfig, trackers

VERSION = '0.15'

BUILD = '2'

trackers = ['wss://tracker.btorrent.xyz', 'wss://tracker.webtorrent.io', 'wss://tracker.openwebtorrent.com', 'wss://tracker.fastcast.nz']

opts = {
  announce: trackers
}

rtcConfig = {
  'iceServers': [
    {
      'url': 'stun:23.21.150.121',
      'urls': 'stun:23.21.150.121'
    }
  ]
}

function blobToFile(theBlob, fileName){
    //A Blob() is almost a File() - it's just missing the two properties below which we will add
    theBlob.lastModifiedDate = new Date();
    theBlob.name = fileName;
    return theBlob;
}


debug = window.localStorage.getItem('debug') != null

dbg = function (string, item, color) {
  color = color != null ? color : '#333333'
  if (debug) {
    if ((item != null) && item.name) {
      return console.debug(`%cβTorrent:${item.infoHash != null ? 'torrent ' : 'torrent ' + item._torrent.name + ':file '}${item.name}${item.infoHash != null ? ' (' + item.infoHash + ')' : ''} %c${string}`, 'color: #33C3F0', `color: ${color}`)
    } else {
      return console.debug(`%cβTorrent:client %c${string}`, 'color: #33C3F0', `color: ${color}`)
    }
  }
}

er = function (err, item) { dbg(err, item, '#FF0000') }

dbg(`Starting... v${VERSION}b${BUILD}`)

client = new WebTorrent({
  tracker: {
    rtcConfig: rtcConfig,
    announce: trackers
  }
})

app = angular.module('BTorrent',
  ['ngRoute', 'ui.grid', 'ui.grid.resizeColumns', 'ui.grid.selection', 'ngFileUpload', 'ngNotify'],
  ['$compileProvider', '$locationProvider', '$routeProvider', function ($compileProvider, $locationProvider, $routeProvider) {
    $compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|magnet|blob|javascript):/)
    $locationProvider.html5Mode({
      enabled: true,
      requireBase: false
    }).hashPrefix('#')
    $routeProvider.when('/view', {
      templateUrl: 'views/view.html',
      controller: 'ViewCtrl'
    }).when('/download', {
      templateUrl: 'views/download.html',
      controller: 'DownloadCtrl'
    }).otherwise({
      templateUrl: 'views/full.html',
      controller: 'FullCtrl'
    })
  }]
)

app.controller('BTorrentCtrl', ['$scope', '$rootScope', '$http', '$log', '$location', 'ngNotify', function ($scope, $rootScope, $http, $log, $location, ngNotify) {
  let updateAll
  $rootScope.version = VERSION
  ngNotify.config({
    duration: 5000,
    html: true
  })
  if (WebTorrent.WEBRTC_SUPPORT == null) {
    $rootScope.disabled = true
    ngNotify.set('Please use latest Chrome, Firefox or Opera', {
      type: 'error',
      sticky: true,
      button: false
    })
  }
  $rootScope.client = client
  scope = $rootScope
  updateAll = function () {
    if ($rootScope.client.processing) {
      return
    }
    $rootScope.$apply()
  }
  setInterval(updateAll, 500)
  $rootScope.seedFiles = function (files) {
    let name
    if ((files != null) && files.length > 0) {
      if (files.length === 1) {
        dbg(`Seeding file ${files[0].name}`)
      } else {
        dbg(`Seeding ${files.length} files`)
        name = prompt('Please name your torrent', 'My Awesome Torrent') || 'My Awesome Torrent'
        opts.name = name
      }
      $rootScope.client.processing = true
      $rootScope.client.seed(files, opts, $rootScope.onSeed)
      delete opts.name
    }
  }
  $rootScope.openTorrentFile = function (file) {
    if (file != null) {
      dbg(`Adding torrent file ${file.name}`)
      $rootScope.client.processing = true
      $rootScope.client.add(file, opts, $rootScope.onTorrent)
    }
  }
  $rootScope.client.on('error', function (err, torrent) {
    $rootScope.client.processing = false
    ngNotify.set(err, 'error')
    er(err, torrent)
  })
  $rootScope.addMagnet = function (magnet, onTorrent) {
    if ((magnet != null) && magnet.length > 0) {
      dbg(`Adding magnet/hash ${magnet}`)
      $rootScope.client.processing = true
      $rootScope.client.add(magnet, opts, onTorrent || $rootScope.onTorrent)
    }
  }
  $rootScope.destroyedTorrent = function (err) {
    if (err) {
      throw err
    }
    dbg('Destroyed torrent', $rootScope.selectedTorrent)
    $rootScope.selectedTorrent = null
    $rootScope.client.processing = false
  }
  $rootScope.changePriority = function (file) {
    if (file.priority === '-1') {
      dbg('Deselected', file)
      file.deselect()
    } else {
      dbg(`Selected with priority ${file.priority}`, file)
      file.select(file.priority)
    }
  }
  $rootScope.onTorrent = function (torrent, isSeed) {
    dbg(torrent.magnetURI)
    torrent.safeTorrentFileURL = torrent.torrentFileBlobURL
    console.log("torrent.torrentFileBlobURL"+torrent.torrentFileBlobURL)
    torrent.fileName = `${torrent.name}.torrent`
    if (!isSeed) {
      dbg('Received metadata', torrent)
      ngNotify.set(`Received ${torrent.name} metadata`)
      if (!($rootScope.selectedTorrent != null)) {
        $rootScope.selectedTorrent = torrent
      }
      $rootScope.client.processing = false
    }
    torrent.files.forEach(function (file) {
      file.getBlobURL(function (err, url) {
        if (err) {
          throw err
        }
        if (isSeed) {
          dbg('Started seeding', torrent)
          if (!($rootScope.selectedTorrent != null)) {
            $rootScope.selectedTorrent = torrent
          }
          $rootScope.client.processing = false
        }
        file.url = url
                $("#viewer").append('<video id="my-video" class="video-js" controls preload="metadata" width="640" height="264" poster="MY_VIDEO_POSTER.jpg" data-setup="{}"><source id="my-video-source" src="'+file.url+'" type="video/mp4"></video>')

        if (!isSeed) {
          dbg('Done ', file)
          ngNotify.set(`<b>${file.name}</b> ready for download`, 'success')
        }
      })
    })
    torrent.on('done', function () {
      if (!isSeed) {
        dbg('Done', torrent)
      }
      ngNotify.set(`<b>${torrent.name}</b> has finished downloading`, 'success')
    })
    torrent.on('wire', function (wire, addr) { dbg(`Wire ${addr}`, torrent) })
    torrent.on('error', er)
  }
  $rootScope.onSeed = function (torrent) { $rootScope.onTorrent(torrent, true) }
  dbg('Ready')
}
])

app.controller('FullCtrl', ['$scope', '$rootScope', '$http', '$log', '$location', 'ngNotify', function ($scope, $rootScope, $http, $log, $location, ngNotify) {
  ngNotify.config({
    duration: 5000,
    html: true
  })
  $scope.addMagnet = function () {
    $rootScope.addMagnet($scope.torrentInput)
    $scope.torrentInput = ''
  }
  $scope.columns = [
    {
      field: 'name',
      cellTooltip: true,
      minWidth: '200'
    }, {
      field: 'length',
      name: 'Size',
      cellFilter: 'pbytes',
      width: '80'
    }, {
      field: 'received',
      displayName: 'Downloaded',
      cellFilter: 'pbytes',
      width: '135'
    }, {
      field: 'downloadSpeed',
      displayName: '↓ Speed',
      cellFilter: 'pbytes:1',
      width: '100'
    }, {
      field: 'progress',
      displayName: 'Progress',
      cellFilter: 'progress',
      width: '100'
    }, {
      field: 'timeRemaining',
      displayName: 'ETA',
      cellFilter: 'humanTime',
      width: '140'
    }, {
      field: 'uploaded',
      displayName: 'Uploaded',
      cellFilter: 'pbytes',
      width: '125'
    }, {
      field: 'uploadSpeed',
      displayName: '↑ Speed',
      cellFilter: 'pbytes:1',
      width: '100'
    }, {
      field: 'numPeers',
      displayName: 'Peers',
      width: '80'
    }, {
      field: 'ratio',
      cellFilter: 'number:2',
      width: '80'
    }
  ]
  $scope.gridOptions = {
    columnDefs: $scope.columns,
    data: $rootScope.client.torrents,
    enableColumnResizing: true,
    enableColumnMenus: false,
    enableRowSelection: true,
    enableRowHeaderSelection: false,
    multiSelect: false
  }
  $scope.gridOptions.onRegisterApi = function (gridApi) {
    $scope.gridApi = gridApi
    gridApi.selection.on.rowSelectionChanged($scope, function (row) {
      if (!row.isSelected && ($rootScope.selectedTorrent != null) && ($rootScope.selectedTorrent.infoHash = row.entity.infoHash)) {
        $rootScope.selectedTorrent = null
      } else {
        $rootScope.selectedTorrent = row.entity
      }
    })
  }
  if ($location.hash() !== '') {
    $rootScope.client.processing = true
    setTimeout(function () {
      dbg(`Adding ${$location.hash()}`)
      $rootScope.addMagnet($location.hash())
    }, 0)
  }
}
])

app.controller('DownloadCtrl', ['$scope', '$rootScope', '$http', '$log', '$location', 'ngNotify', function ($scope, $rootScope, $http, $log, $location, ngNotify) {
  ngNotify.config({
    duration: 5000,
    html: true
  })
  $scope.addMagnet = function() {
    $rootScope.addMagnet($scope.torrentInput)
    $scope.torrentInput = ''
  }
  if ($location.hash() !== '') {
    $rootScope.client.processing = true
    setTimeout(function () {
      dbg(`Adding ${$location.hash()}`)
      $rootScope.addMagnet($location.hash())
    }, 0)
  }
}
])

app.controller('ViewCtrl', ['$scope', '$rootScope', '$http', '$log', '$location', 'ngNotify', function ($scope, $rootScope, $http, $log, $location, ngNotify) {
  let onTorrent
  ngNotify.config({
    duration: 2000,
    html: true
  })
  onTorrent = function (torrent) {
    $rootScope.viewerStyle = {
      'margin-top': '-20px',
      'text-align': 'center'
    }
    dbg(torrent.magnetURI)
    torrent.safeTorrentFileURL = torrent.torrentFileBlobURL
    torrent.fileName = `${torrent.name}.torrent`
    $rootScope.selectedTorrent = torrent
    $rootScope.client.processing = false
    dbg('Received metadata', torrent)
    ngNotify.set(`Received ${torrent.name} metadata`)
    torrent.files.forEach(function (file) {
        /*console.log("file" +file);
        blob = new Blob([file], {type: "video/mp4"}),
        console.log("blob" +blob);
        url = window.URL.createObjectURL(file);
        console.log("url" +url);
        */
        /*var binaryData = [];
        binaryData.push(file);
        console.log("binaryData "+binaryData)
        var url = window.URL.createObjectURL(new Blob(binaryData, {type: "video/mp4"}))
        */



        var url = window.URL.createObjectURL(new Blob(file, {type: "video/mp4"}))
        console.log("url "+url)
        $("#banca").append('<video controls autoplay width="640" height="264"><source id="my-video-source" src="'+url+'" type="video/mp4"></video>') 


        /*
        
        ESTO ROMPE EL CHROME.... TAL VEZ SEA EXACTAMENTE LO QUE BUSCAMOS

        var url = window.URL.createObjectURL(new Blob(file, {type: "video/mp4"}))
        console.log("url "+url)
        $("#banca").append('<video controls autoplay width="640" height="264"><source id="my-video-source" src="'+url+'" type="video/mp4"></video>') 
        */

        /*
        
        ESTO FUNCIONA DELICIOSAMENTE BIEN, PERO SOLO CUANDO EL DOWNLOAD HA SIDO COMPLETO

        file.getBlobURL(function (err, url) {
          console.log("url "+url)
          $("#banca").append('<video controls autoplay width="640" height="264"><source id="my-video-source" src="'+url+'" type="video/mp4"></video>') 
        })
        */
              

        /*
      file.appendTo('#viewer')
      file.getBlobURL(function (err, url) {
        if (err) {
          throw err
        }
        file.url = url
        console.log("file.url"+file.url)



        //dbg('Done ', file)
      })
      */
    })
    torrent.on('done', dbg('Done', torrent))
    torrent.on('wire', function (wire, addr) { dbg(`Wire ${addr}`, torrent) })
    torrent.on('error', er)
  }

  $scope.addMagnet = function () {
    $rootScope.addMagnet($scope.torrentInput, onTorrent)
    $scope.torrentInput = ''
  }
  if ($location.hash() !== '') {
    $rootScope.client.processing = true
    setTimeout(function () {
      dbg(`Adding ${$location.hash()}`)
      $rootScope.addMagnet($location.hash(), onTorrent)
    }, 0)
  }
}
])

app.filter('html', [
  '$sce', function ($sce) {
    return function (input) {
      $sce.trustAsHtml(input)
    }
  }
])

app.filter('pbytes', function () {
  return function (num, speed) {
    let exponent, unit, units
    if (isNaN(num)) {
      return ''
    }
    units = ['B', 'kB', 'MB', 'GB', 'TB']
    if (num < 1) {
      return (speed ? '' : '0 B')
    }
    exponent = Math.min(Math.floor(Math.log(num) / 6.907755278982137), 8)
    num = (num / Math.pow(1000, exponent)).toFixed(1) * 1
    unit = units[exponent]
    return `${num} ${unit}${speed ? '/s' : ''}`
  }
})

app.filter('humanTime', function () {
  return function (millis) {
    let remaining
    if (millis < 1000) {
      return ''
    }
    remaining = moment.duration(millis).humanize()
    return remaining[0].toUpperCase() + remaining.substr(1)
  }
})

app.filter('progress', function () { return function (num) { `${(100 * num).toFixed(1)}%` } })
