app.controller('bibListeCreateCtrl',[ '$scope','$filter', '$http','$uibModal','$route','$routeParams','NgTableParams','toaster', 'backendCfg','loginSrv',
  function($scope,$filter, $http,$uibModal,$route, $routeParams,NgTableParams,toaster,backendCfg,loginSrv) {
    var self = this;
    self.route='listes';
    self.showSpinner = false;
    self.formCreate = {
        "id_liste" : "",
        "nom_liste" : "",
        "des_liste" : "",
        "picto" : "nopicto.gif",
        "regne" : "",
        "group2_inpn" : "Autres"
    };
    
    //----------------------Gestion des droits---------------//
    if (loginSrv.getCurrentUser()) {
        self.userRightLevel = loginSrv.getCurrentUser().id_droit_max;
        // gestion de l'onglet actif ; 0 par default
        if (self.userRightLevel==backendCfg.user_low_privilege) {
        self.activeForm = 2;
        }
    }
    self.userRights = loginSrv.getCurrentUserRights();

    self.submit = function() {
    }

}]);