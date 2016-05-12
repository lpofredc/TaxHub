
app.controller('taxonsCtrl', [ '$scope', '$routeParams','$http','locationHistoryService','$location','toaster',
function($scope, $routeParams, $http, locationHistoryService, $location, toaster) {
  var self = this;
  self.route='taxons';
  self.bibTaxon = {};
  self.bibTaxon.attributs_values = {};
  self.previousLocation = locationHistoryService.get();

  var toasterMsg = {
    'saveSuccess':{"title":"Taxon enregistré", "msg": "Le taxon a été enregistré avec succès"},
    'saveError':{"title":"Erreur d'enregistrement"},
  }


  var action = $routeParams.action;
  var self = this;
  if ($routeParams.id) {
    if (action == 'new') self.cd_nom = $routeParams.id;
    else {
      self.id_taxon = $routeParams.id;
      $http.get("bibtaxons/"+self.id_taxon).then(function(response) {
        if (response.data) {
          self.bibTaxon = response.data;
          self.cd_nom = response.data.cd_nom;
          self.bibTaxon.attributs_values = {};
          if (response.data.attributs) {
            angular.forEach(response.data.attributs, function(value, key) {
              if (value.type_widget==="number") value.valeur_attribut = Number(value.valeur_attribut);
                self.bibTaxon.attributs_values[value.id_attribut] =  value.valeur_attribut;
            });
            delete self.bibTaxon.attributs;
          }
        }
      });
    }
  }
  $scope.$watch(function () {
    return self.cd_nom;
  }, function(newVal, oldVal) {
    if (newVal) {
      $http.get("taxref/"+self.cd_nom).then(function(response) {
        self.taxref = response.data;
        self.bibTaxon.cd_nom = response.data.cd_nom;
        self.bibTaxon.nom_latin = response.data.nom_complet;
        self.bibTaxon.auteur = response.data.lb_auteur;
        self.bibTaxon.nom_francais = response.data.nom_vern;
      });
    }
  });

  self.refreshTaxrefData = function() {
    self.cd_nom = self.bibTaxon.cd_nom;
  }

  //------------------------------ Chargement de la listes des attributs ----------------------/
  ///bibattributs/Animalia/Autre
  $scope.$watch(function () {
    return self.taxref;
  }, function(newVal, oldVal) {
    if (newVal) {
      $http.get("bibattributs/"+newVal.regne+"/"+newVal.group2_inpn).then(function(response) {
        self.attributsDefList = response.data;
        angular.forEach(self.attributsDefList, function(value, key) {
          value.listeValeurObj =JSON.parse(value.listeValeurAttribut);
        });
      });
    }
  });
  //------------------------------ Sauvegarde du formulaire ----------------------------------/
  self.submit = function() {
    var params = self.bibTaxon;
    var url = "bibtaxons";
    if(action == 'edit'){url=url+'/'+self.bibTaxon.id_taxon;}
    $http.post(url, params)
    .success(function(data, status, headers, config) {
      if (data.success == true){
        toaster.pop('success', toasterMsg.saveSuccess.title, toasterMsg.saveSuccess.msg, 5000, 'trustedHtml');
        var nextPath = 'taxon/'+self.bibTaxon.id_taxon;
        if (self.previousLocation) nextPath = self.previousLocation;
        $location.path(nextPath).replace();
      }
      if (data.success == false){
          toaster.pop('success', toasterMsg.saveError.title, data.message, 5000, 'trustedHtml');
      }
    })
    .error(function(data, status, headers, config) {
        toaster.pop('success', toasterMsg.saveError.title, data.message, 5000, 'trustedHtml');
    });
  }
}
]);
