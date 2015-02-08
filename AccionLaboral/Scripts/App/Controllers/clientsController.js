'use strict';

angular.module("clientsController", ['ngRoute', 'clientsRepository', 'alertRepository'])
.config(['$routeProvider', function ($routeProvider) {
    $routeProvider.
        when('/RegisterClient', {
            templateUrl: '/Clients/Create',
            controller: 'CustomerController'
        }).
        when('/AllClients', {
            templateUrl: '/Clients/Index',
            controller: 'CustomerController'
        }).
        when("/editClient/:id", {
            title: 'Editar usuario',
            templateUrl: "/Clients/Edit",
            controller: "editCustomerController"
        }).
        when("/EnrollClient", {
            title: 'Inscribir Cliente',
            templateUrl: "/Clients/Enroll",
            controller: "EnrollCustomerController"
        }).
        when("/ClientTracking", {
            title: 'Seguimiento de Clientes',
            templateUrl: "/Clients/Tracking",
            controller: "CustomerTrackingController"
        }).
        when("/ClientTracking/:id", {
            title: 'Seguimiento de Clientes',
            templateUrl: "/Clients/ClientTracking",
            controller: "CustomerTrackingController"
        });
}])
.controller('CustomerController', ['$scope', '$rootScope', '$location', '$filter', 'customerRepository', 'filterFilter', 'alertService', function ($scope, $rootScope, $location, $filter, customerRepository, filterFilter, alertService) {
    //enroll costumer
    $scope.enrollClientExist = false;
    $scope.showMsgErrorClient = false;
    if (!$rootScope.alerts)
        $rootScope.alerts = [];

    $scope.back = function () {
        $location.path("/AllClients");
    };

        $scope.calculateAge = function() {
            var birthday = +new Date($scope.New.Birthday);
            var age = ~~((Date.now() - birthday) / (31557600000));
            $scope.New.Age = age;
        }
        $scope.handleFileSelectAdd = function(evt) {
            
            var f = evt.target.files[0];
            var reader = new FileReader();
            reader.onload = (function(theFile) {
                return function (e) {
                    var filePayload = e.target.result;
                    $scope.episodeImgData = filePayload.replace('data:'+f.type +';base64,', '');
                    document.getElementById('imagen').src = filePayload;
                };
            })(f);
            reader.readAsDataURL(f);
        };

    //Sorting
        $scope.sort = "FirstName";
        $scope.reverse = false;

        $scope.changeSort = function (value) {
            if ($scope.sort == value) {
                $scope.reverse = !$scope.reverse;
                return;
            }

            $scope.sort = value;
            $scope.reverse = false;
        }
        //End Sorting//
        $scope.itemsPerPageList = [5, 10, 20, 30, 40, 50];
        $scope.entryLimit = $scope.itemsPerPageList[0];
        $scope.currentPage = 1; //current page
        $scope.setData = function (term) {
            if(!term)
                $scope.load = true;
            else
                //if (term.State) {
                    term.StateId = (!term.StateId) ? "" : term.StateId;
                //}

            customerRepository.getCustomers().success(function(data) {
                        $scope.customerData = data;
                        $scope.totalServerItems = data.totalItems;
                        $scope.items = data.items;
                        $scope.load = false;

                        if ($rootScope.alerts)
                        $scope.alertsTags = $rootScope.alerts;
                $scope.maxSize = 5; //pagination max size
                 //max rows for data table

                /* init pagination with $scope.list */
                $scope.setFiltered(term);
                    
                })
                    .error(function(data) {
                        alertService.add('danger', 'Error', 'No se han cargado los datos correctamente.');
                        $scope.alertsTags = $rootScope.alerts;
                        $scope.load = false;
                    });
        };
        
        $scope.setFiltered = function (term) {
            $scope.filtered = filterFilter($scope.customerData, term);

            $scope.itemsInPage = ($scope.filtered.length) ? ((($scope.currentPage * $scope.entryLimit) > $scope.filtered.length) ?
                    $scope.filtered.length - (($scope.currentPage - 1) * $scope.entryLimit) : $scope.entryLimit) : 0;
            $scope.noOfPages = ($scope.filtered) ? Math.ceil($scope.filtered.length / $scope.entryLimit) : 1;
        };

        $scope.$watch('search', function (term) {
                $scope.setData(term);

        });

        $scope.academicEducations = [], $scope.knownLanguages = [], $scope.knownPrograms = [], $scope.personalReferences = [], $scope.workReferences = [], $scope.workExperiences = [], $scope.Trannings = [];

        var imageElement = document.getElementById('exampleInputFile');
        if (imageElement)
            imageElement.addEventListener('change', $scope.handleFileSelectAdd, false);
        $scope.index = -1;
        $scope.action = '';
        $scope.load = true;
        $scope.selectedClient = -1;
        
        $scope.setClientToDelete = function(id) {
            $scope.selectedClient = id;
        }
        $scope.addAcademicEducation = function () {
            if ($scope.academicEducationModal.$valid) {
                if ($scope.action == 'edit') {
                    $scope.academicEducations[$scope.index].TrainingName = $scope.TrainingName,
                        $scope.academicEducations[$scope.index].InstitutionName = $scope.InstitutionName,
                        $scope.academicEducations[$scope.index].AcademicLevel = $scope.AcademicLevel,
                        $scope.academicEducations[$scope.index].CareerId = $scope.CareerId,
                        $scope.academicEducations[$scope.index].EducationTypeId = $scope.EducationTypeId,
                        $scope.academicEducations[$scope.index].City = $scope.City,
                        $scope.academicEducations[$scope.index].Year = $scope.Year,
                        $scope.academicEducations[$scope.index].Country = $scope.Country;
                    alertService.add('success', 'Enhorabuena', 'Registro se ha actualizado correctamente.');
                    $scope.alertsTags = $rootScope.alerts;
                } else {
                    var education = {
                        TrainingName: $scope.TrainingName,
                        InstitutionName: $scope.InstitutionName,
                        AcademicLevel: $scope.AcademicLevel,
                        CareerId: $scope.CareerId,
                        EducationTypeId: $scope.EducationTypeId,
                        City: $scope.City,
                        Year: $scope.Year,
                        Country: $scope.Country
                    };
                    $scope.academicEducations.push(education);
                    alertService.add('success', 'Enhorabuena', 'Registro se ha insertado correctamente.');
                    $scope.alertsTags = $rootScope.alerts;
                }
            } else {
                alertService.add('danger', 'Error', 'Complete todos los campos correctamente.');
                $scope.alertsTags = $rootScope.alerts;
            }
            $scope.action = '';
            $scope.index = -1;
        };
        $scope.fillAcademicEducation = function (index) {
                $scope.textButton = 'Editar';
                $scope.TrainingName = $scope.academicEducations[index].TrainingName,
                    $scope.InstitutionName = $scope.academicEducations[index].InstitutionName,
                    $scope.AcademicLevel = $scope.academicEducations[index].AcademicLevel,
                    $scope.CareerId = $scope.academicEducations[index].CareerId,
                    $scope.EducationTypeId = $scope.academicEducations[index].EducationTypeId,
                    $scope.City = $scope.academicEducations[index].City,
                    $scope.Year = $scope.academicEducations[index].Year,
                    $scope.Country = $scope.academicEducations[index].Country;
                $scope.action = 'edit';
                $scope.index = index;
        }
        $scope.clearAcademicEducation = function () {
            $scope.textButton = 'Agregar';
            $scope.TrainingName = "",
            $scope.InstitutionName = "",
            $scope.AcademicLevel = "",
            $scope.CareerId = "",
            $scope.EducationTypeId = "";
            $scope.City = "",
            $scope.Year = "",
            $scope.Country = "";
        };
        $scope.removeAcademicEducation = function(index) {
            $scope.academicEducations.splice(index, 1);
            alertService.add('success', 'Enhorabuena', 'Registro se ha eliminado correctamente.');
            $scope.alertsTags = $rootScope.alerts;
        };

        /*Languages*/
        $scope.clearKnownLanguage = function () {
            $scope.textButton = 'Agregar';
            $scope.Percentage = "",
            $scope.Language = "",
            $scope.LanguageLevel = "";
            $scope.action = '';
            $scope.index = -1;
        };
        $scope.fillKnownLanguage = function (index) {
            $scope.textButton = 'Editar';
            $scope.Percentage = $scope.knownLanguages[index].Percentage,
            $scope.Language = $scope.knownLanguages[index].Language,
            $scope.LanguageLevel = $scope.knownLanguages[index].LanguageLevel;
            $scope.action = 'edit';
            $scope.index = index;
        };
        $scope.addKnownLanguage = function () {
            if ($scope.FormLanguage.$valid){
            if ($scope.action=='edit') {
                $scope.knownLanguages[$scope.index].Percentage = $scope.Percentage,
                    $scope.knownLanguages[$scope.index].Language = $scope.Language,
                    $scope.knownLanguages[$scope.index].LanguageLevel = $scope.LanguageLevel;
                alertService.add('success', 'Enhorabuena', 'Registro se ha actualizado correctamente.');
                $scope.alertsTags = $rootScope.alerts;
            } else {
                var lang = {
                    Percentage: $scope.Percentage,
                    Language: $scope.Language,
                    LanguageLevel: $scope.LanguageLevel
                };
                $scope.knownLanguages.push(lang);
                $scope.clearKnownLanguage();
                alertService.add('success', 'Enhorabuena', 'Registro se ha insertado correctamente.');
                $scope.alertsTags = $rootScope.alerts;
            }
            } else {
                alertService.add('danger', 'Error', 'Complete todos los campos correctamente.');
                $scope.alertsTags = $rootScope.alerts;
            }
        };
        $scope.removeKnownLanguage = function (index) {
            $scope.knownLanguages.splice(index, 1);
            alertService.add('success', 'Enhorabuena', 'Registro se ha eliminado correctamente.');
            $scope.alertsTags = $rootScope.alerts;
        };
        $scope.removeWorkExperience = function(index) {
            $scope.workExperiences.splice(index, 1);
            alertService.add('success', 'Enhorabuena', 'Registro se ha eliminado correctamente.');
            $scope.alertsTags = $rootScope.alerts;
        };
        $scope.removeWorkReference = function(index) {
            $scope.workReferences.splice(index, 1);
            alertService.add('success', 'Enhorabuena', 'Registro se ha eliminado correctamente.');
            $scope.alertsTags = $rootScope.alerts;
        };
        $scope.removePersonalReference = function(index) {
            $scope.personalReferences.splice(index, 1);
            alertService.add('success', 'Enhorabuena', 'Registro se ha eliminado correctamente.');
            $scope.alertsTags = $rootScope.alerts;
        };

        /*Programs*/
        $scope.clearProgram = function () {
            $scope.textButton = 'Agregar';
            $scope.NameProgram = "";
            $scope.action = '';
            $scope.index = -1;
        };
        $scope.fillKnownProgram = function (index) {
            $scope.textButton = 'Editar';
        $scope.NameProgram = $scope.knownPrograms[index].Name;
        $scope.action = 'edit';
        $scope.index = index;
    };
        $scope.addKnownProgram = function () {
            if ($scope.FormProgram.$valid) {
                if ($scope.action == 'edit') {
                    $scope.knownPrograms[$scope.index].Name = $scope.NameProgram;
                    alertService.add('success', 'Enhorabuena', 'Registro se ha actualizado correctamente.');
                    $scope.alertsTags = $rootScope.alerts;
                } else {
                    var program = {
                        Name: $scope.NameProgram
                    };
                    $scope.knownPrograms.push(program);
                    $scope.clearProgram();
                    alertService.add('success', 'Enhorabuena', 'Registro se ha insertado correctamente.');
                    $scope.alertsTags = $rootScope.alerts;
                }
            } else {
                alertService.add('danger', 'Error', 'Complete todos los campos correctamente.');
                $scope.alertsTags = $rootScope.alerts;
            }
        };
    $scope.removeKnownProgram = function (index) {
        $scope.knownPrograms.splice(index, 1);
        alertService.add('success', 'Enhorabuena', 'Registro se ha eliminado correctamente.');
        $scope.alertsTags = $rootScope.alerts;
    };

        /*WorkExperience*/
    $scope.clearWorkExperience = function () {
        $scope.textButton = 'Agregar';
            $scope.CompanyName = "";
            $scope.CompanyArea = "";
            $scope.Charge = "";
            $scope.StartDate = "";
            $scope.EndDate = "";
            $scope.Achievements = "";
            $scope.WorkCountry = "";
            $scope.WorkCity = "";
            $scope.action = '';
            $scope.index = -1;
        };
    $scope.fillWorkExperience = function (index) {
        $scope.textButton = 'Editar';
        $scope.CompanyName = $scope.workExperiences[index].CompanyName,
            $scope.CompanyArea = $scope.workExperiences[index].CompanyArea,
            $scope.Charge = $scope.workExperiences[index].Charge,
            $scope.StartDate = $scope.workExperiences[index].StartDate,
            $scope.EndDate = $scope.workExperiences[index].EndDate,
            $scope.Achievements = $scope.workExperiences[index].Archievements,
            $scope.WorkCity = $scope.workExperiences[index].WorkCity,
            $scope.WorkCountry = $scope.workExperiences[index].WorkCountry;
        $scope.action = 'edit';
        $scope.index = index;
    };
    $scope.addWorkExperience = function () {
        if ($scope.formWorkExperience.$valid) {
            if ($scope.action == 'edit') {
                $scope.workExperiences[$scope.index].CompanyName = $scope.CompanyName,
                    $scope.workExperiences[$scope.index].CompanyArea = $scope.CompanyArea,
                    $scope.workExperiences[$scope.index].Charge = $scope.Charge,
                    $scope.workExperiences[$scope.index].StartDate = $scope.StartDate,
                    $scope.workExperiences[$scope.index].EndDate = $scope.EndDate,
                    $scope.workExperiences[$scope.index].Archievements = $scope.Achievements,
                    $scope.workExperiences[$scope.index].WorkCity = $scope.WorkCity,
                    $scope.workExperiences[$scope.index].WorkCountry = $scope.WorkCountry;
                alertService.add('success', 'Enhorabuena', 'Registro se ha actualizado correctamente.');
                $scope.alertsTags = $rootScope.alerts;
            } else {
                var experience = {
                    CompanyName: $scope.CompanyName,
                    CompanyArea: $scope.CompanyArea,
                    Charge: $scope.Charge,
                    StartDate: $scope.StartDate,
                    EndDate: $scope.EndDate,
                    Achievements: $scope.Achievements,
                    WorkCity: $scope.WorkCity,
                    WorkCountry: $scope.WorkCountry
                };
                $scope.workExperiences.push(experience);
                $scope.clearWorkExperience();
                alertService.add('success', 'Enhorabuena', 'Registro se ha insertado correctamente.');
                $scope.alertsTags = $rootScope.alerts;
            }
        } else {
            alertService.add('danger', 'Error', 'Complete todos los campos correctamente.');
            $scope.alertsTags = $rootScope.alerts;
        }
    };
    $scope.removeWorkExperience = function (index) {
        $scope.workExperiences.splice(index, 1);
        alertService.add('success', 'Enhorabuena', 'Registro se ha eliminado correctamente.');
        $scope.alertsTags = $rootScope.alerts;
    };
        /*WorkReference*/
    $scope.clearWorkReference = function () {
        $scope.textButton = "Agregar";
        $scope.FirstNameWRef = "";
        $scope.LastNameWRef = "";
        $scope.ChargeWRef = "";
        $scope.CellphoneWRef = "";
        $scope.EmailWRef = "";
        $scope.CompanyNameWRef = "";
        $scope.RelationshipWRef = "";
        $scope.CityWRef = "";
        $scope.CountryWRef = "";
        $scope.action = '';
        $scope.index = -1;
    };
    $scope.fillWorkReference = function (index) {
        $scope.textButton = 'Editar';
        $scope.FirstNameWRef = $scope.workReferences[indupex].FirstName,
            $scope.LastNameWRef = $scope.workReferences[index].LastName,
            $scope.ChargeWRef = $scope.workReferences[index].Charge,
            $scope.CellphoneWRef = $scope.workReferences[index].Cellphone,
            $scope.EmailWRef = $scope.workReferences[index].Email,
            $scope.CompanyNameWRef = $scope.workReferences[index].CompanyName,
            $scope.RelationshipWRef = $scope.workReferences[index].Relationship,
            $scope.CityWRef = $scope.workReferences[index].City,
            $scope.CountryWRef = $scope.workReferences[index].Country;
        $scope.action = 'edit';
        $scope.index = index;
    };
    $scope.addWorkReference = function () {
        if ($scope.formWorkReference.$valid) {
            if ($scope.action == 'edit') {
                $scope.workReferences[$scope.index].FirstName = $scope.FirstNameWRef,
                    $scope.workReferences[$scope.index].LastName = $scope.LastNameWRef,
                    $scope.workReferences[$scope.index].Charge = $scope.ChargeWRef,
                    $scope.workReferences[$scope.index].Cellphone = $scope.CellphoneWRef,
                    $scope.workReferences[$scope.index].Email = $scope.EmailWRef,
                    $scope.workReferences[$scope.index].CompanyName = $scope.CompanyNameWRef,
                    $scope.workReferences[$scope.index].Relationship = $scope.RelationshipWRef,
                    $scope.workReferences[$scope.index].City = $scope.CityWRef,
                    $scope.workReferences[$scope.index].Country = $scope.CountryWRef;
                alertService.add('success', 'Enhorabuena', 'Registro se ha actualizado correctamente.');
                $scope.alertsTags = $rootScope.alerts;
            } else {
                var wReference = {
                    FirstName: $scope.FirstNameWRef,
                    LastName: $scope.LastNameWRef,
                    Charge: $scope.ChargeWRef,
                    Cellphone: $scope.CellphoneWRef,
                    Email: $scope.EmailWRef,
                    CompanyName: $scope.CompanyNameWRef,
                    Relationship: $scope.RelationshipWRef,
                    City: $scope.CityWRef,
                    Country: $scope.CountryWRef
                };
                $scope.workReferences.push(wReference);
                $scope.clearWorkReference();
                alertService.add('success', 'Enhorabuena', 'Registro se ha insertado correctamente.');
                $scope.alertsTags = $rootScope.alerts;
            }
        } else {
            alertService.add('danger', 'Error', 'Complete todos los campos correctamente.');
            $scope.alertsTags = $rootScope.alerts;
        }
    };
    $scope.removeWorkReference = function (index) {
        $scope.workReferences.splice(index, 1);
        alertService.add('success', 'Enhorabuena', 'Registro se ha eliminado correctamente.');
        $scope.alertsTags = $rootScope.alerts;
    };

        /*PersonalReference*/
    $scope.clearPersonalReference = function () {
        $scope.textButton = 'Agregar';
                    $scope.FirstNamePRef = "";
                    $scope.LastNamePRef = "";
                    $scope.ChargePRef = "";
                    $scope.CellphonePRef = "";
                    $scope.EmailPRef = "";
                    $scope.CompanyNamePRef = "";
                    $scope.RelationshipPRef = "";
                    $scope.CityPRef = "";
                    $scope.CountryPRef = "";
                    $scope.action = '';
                    $scope.index = -1;
                };
    $scope.fillPersonalReference = function (index) {
        $scope.textButton = 'Editar';
            $scope.FirstNamePRef = $scope.personalReferences[index].FirstName,
                $scope.LastNamePRef = $scope.personalReferences[index].LastName,
                $scope.ChargePRef = $scope.personalReferences[index].Charge,
                $scope.CellphonePRef = $scope.personalReferences[index].Cellphone,
                $scope.EmailPRef = $scope.personalReferences[index].Email,
                $scope.CompanyNamePRef = $scope.personalReferences[index].CompanyName,
                $scope.RelationshipPRef = $scope.personalReferences[index].Relationship,
                $scope.CityPRef = $scope.personalReferences[index].City;
            $scope.action = 'edit';
            $scope.index = index;
        };
    $scope.addPersonalReference = function () {
        if ($scope.formPersonalRef.$valid) {
            if ($scope.action == 'edit') {
                $scope.personalReferences[$scope.index].FirstName = $scope.FirstNamePRef,
                    $scope.personalReferences[$scope.index].LastName = $scope.LastNamePRef,
                    $scope.personalReferences[$scope.index].Charge = $scope.ChargePRef,
                    $scope.personalReferences[$scope.index].Cellphone = $scope.CellphonePRef,
                    $scope.personalReferences[$scope.index].Email = $scope.EmailPRef,
                    $scope.personalReferences[$scope.index].CompanyName = $scope.CompanyNamePRef,
                    $scope.personalReferences[$scope.index].Relationship = $scope.RelationshipPRef,
                    $scope.personalReferences[$scope.index].City = $scope.CityPRef,
                    $scope.personalReferences[$scope.index].Country = $scope.CountryPRef;
                alertService.add('success', 'Enhorabuena', 'Registro se ha actualizado correctamente.');
                $scope.alertsTags = $rootScope.alerts;
            } else {
                var pReference = {
                    FirstName: $scope.FirstNamePRef,
                    LastName: $scope.LastNamePRef,
                    Charge: $scope.ChargePRef,
                    Cellphone: $scope.CellphonePRef,
                    Email: $scope.EmailPRef,
                    CompanyName: $scope.CompanyNamePRef,
                    Relationship: $scope.RelationshipPRef,
                    City: $scope.CityPRef,
                    Country: $scope.CountryPRef
                };
                $scope.personalReferences.push(pReference);
                $scope.clearPersonalReference();
                alertService.add('success', 'Enhorabuena', 'Registro se ha insertado correctamente.');
                $scope.alertsTags = $rootScope.alerts;
            }
        } else {
            alertService.add('danger', 'Error', 'Complete todos los campos correctamente.');
            $scope.alertsTags = $rootScope.alerts;
        }
    };
    $scope.removePersonalReference = function (index) {
        $scope.personalReferences.splice(index, 1);
        alertService.add('success', 'Enhorabuena', 'Registro se ha eliminado correctamente.');
        $scope.alertsTags = $rootScope.alerts;
    };

        /*Tranning*/
    $scope.clearTranning = function () {
        $scope.textButton = 'Agregar';
                    $scope._TrainingName = "",
                        $scope._InstitutionName = "",
                        $scope._AcademicLevel = "",
                        $scope._EducationTypeId = "",
                        $scope._City = "",
                        $scope._Year = "",
                        $scope._Country = "";
                    $scope.action = '';
                    $scope.index = -1;
                };
        $scope.fillTranning = function(index) {
                    $scope.textButton = "Editar";
                    $scope._TrainingName = $scope.Trannings[index].TrainingName,
                        $scope._InstitutionName = $scope.Trannings[index].InstitutionName,
                        $scope._CareerId = $scope.Trannings[index].CareerId,
                        $scope._EducationTypeId = $scope.Trannings[index].EducationTypeId,
                        $scope._City = $scope.Trannings[index].City,
                        $scope._Year = $scope.Trannings[index].Year,
                        $scope._Country = $scope.Trannings[index].Country;
                    $scope.action = 'edit';
                    $scope.index = index;
                };
        $scope.addTranning = function () {
            if ($scope.trainingForm.$valid) {
                if ($scope.action == 'edit') {
                    $scope.Trannings[$scope.index].TrainingName = $scope._TrainingName,
                        $scope.Trannings[$scope.index].InstitutionName = $scope._InstitutionName,
                        $scope.Trannings[$scope.index].CareerId = $scope._Career.CareerId,
                        $scope.Trannings[$scope.index].City = $scope._City,
                        $scope.Trannings[$scope.index].Year = $scope._Year,
                        $scope.Trannings[$scope.index].Country = $scope._Country;
                    alertService.add('success', 'Enhorabuena', 'Registro se ha actualizado correctamente.');
                    $scope.alertsTags = $rootScope.alerts;
                } else {
                    var tranning = {
                        TrainingName: $scope._TrainingName,
                        InstitutionName: $scope._InstitutionName,
                        CareerId: $scope._Career.CareerId,
                        EducationTypeId: $scope._EducationTypeId,
                        City: $scope._City,
                        Year: $scope._Year,
                        Country: $scope._Country
                    };
                    $scope.Trannings.push(tranning);
                    $scope.clearTranning();
                    alertService.add('success', 'Enhorabuena', 'Registro se ha insertado correctamente.');
                    $scope.alertsTags = $rootScope.alerts;
                }
            } else {
                alertService.add('danger', 'Error', 'Complete todos los campos correctamente.');
                $scope.alertsTags = $rootScope.alerts;
            }
        };

        $scope.removeTranning = function(index) {
            $scope.Trannings.splice(index, 1);
            alertService.add('success', 'Enhorabuena', 'Registro se ha eliminado correctamente.');
            $scope.alertsTags = $rootScope.alerts;
        };

                customerRepository.getCareers().success(function (data) {
                    $scope.AllCarees = data;
                });

                customerRepository.getCities().success(function(data) {
                    $scope.Cities = data;
                });
                customerRepository.getCountries().success(function(data) {
                    $scope.Countries = data;
                });
                customerRepository.getAcademicLevels().success(function(data) {

                    $scope.AcademicLevels = data;
                });
                customerRepository.getEducationTypes().success(function(data) {

                    $scope.EducationTypes = data;
                });
                customerRepository.getLanguages().success(function(data) {

                    $scope.Languages = data;
                });
                customerRepository.getLanguageLevels().success(function(data) {

                    $scope.LanguageLevels = data;
                });
                $scope.getStates = function () {
                    customerRepository.getStates().success(function (data) {
                        $scope.States = data;
                    });
                };
                
        $scope.assignCareers = function() {
            if ($scope.AcademicLevel)
                $scope.Careers = $scope.AcademicLevel.Careers;
        };
        $scope.getCitiesByCountry = function(countryId) {
            if (countryId)
                return $filter('filter')($scope.Countries, { CountryId: countryId })[0].Cities;
        };             

                $scope.setScope = function(obj, action) {

                    $scope.action = action;
                    $scope.New = obj;
                    $location.url('editClient/' + obj.ClientId);
                };

                $scope.update = function() {
                    if ($scope.clientForm.$valid) {
                        if ($scope.episodeImgData)
                            $scope.New.Photo = $scope.episodeImgData.replace(/data:image\/jpeg;base64,/g, '');

                        $scope.New.AcademicEducations = [];
                        if ($scope.academicEducations.length > 0) {

                            for (var i = 0; i < $scope.academicEducations.length; i++) {
                                var academic = {
                                    Year: $scope.academicEducations[i].Year,
                                    CountryId: $scope.academicEducations[i].Country.CountryId,
                                    CityId: $scope.academicEducations[i].City.CityId,
                                    AcademicLevelId: $scope.academicEducations[i].AcademicLevel.AcademicLevelId,
                                    TrainingName: $scope.academicEducations[i].TrainingName,
                                    InstitutionName: $scope.academicEducations[i].InstitutionName,
                                    CareerId: $scope.academicEducations[i].CareerId,
                                    EducationTypeId: 1
                                };
                                $scope.New.AcademicEducations.push(academic);
                            }
                        }

                        if ($scope.knownLanguages.length > 0) {
                            $scope.New.Languages = [];
                            for (var j = 0; j < $scope.knownLanguages.length; j++) {
                                var language = {
                                    LanguageId: $scope.knownLanguages[j].Language.LanguageId,
                                    LanguageLevelId: $scope.knownLanguages[j].LanguageLevel.LanguageLevelId,
                                    Percentage: $scope.knownLanguages[j].Percentage
                                };
                                $scope.New.Languages.push(language);
                            }
                        }
                        if ($scope.knownPrograms.length > 0) {
                            $scope.New.KnownPrograms = [];
                            for (var j = 0; j < $scope.knownPrograms.length; j++) {
                                var program = {
                                    Name: $scope.knownPrograms[j].Name
                                };
                                $scope.New.KnownPrograms.push(program);
                            }
                        }

                        if ($scope.workExperiences.length > 0) {
                            $scope.New.workExperiences = [];
                            for (var k = 0; k < $scope.workExperiences.length; k++) {
                                var experience = {
                                    CompanyName: $scope.workExperiences[k].CompanyName,
                                    CompanyArea: $scope.workExperiences[k].CompanyArea,
                                    Charge: $scope.workExperiences[k].Charge,
                                    StartDate: $scope.workExperiences[k].StartDate,
                                    EndDate: $scope.workExperiences[k].EndDate,
                                    Achievements: $scope.workExperiences[k].Achievements,
                                    CityId: $scope.workExperiences[k].WorkCity.CityId
                                };
                                $scope.New.workExperiences.push(experience);
                            }
                        }

                        if ($scope.workReferences.length > 0) {
                            $scope.New.workReferences = [];
                            for (var l = 0; l < $scope.workReferences.length; l++) {
                                var wExperience = {
                                    FirstName: $scope.workReferences[l].FirstName,
                                    LastName: $scope.workReferences[l].LastName,
                                    Charge: $scope.workReferences[l].Charge,
                                    Cellphone: $scope.workReferences[l].Cellphone,
                                    Email: $scope.workReferences[l].Email,
                                    CompanyName: $scope.workReferences[l].CompanyName,
                                    Relationship: $scope.workReferences[l].Relationship,
                                    ReferenceTypeId: 1,
                                    CityId: $scope.workReferences[l].City.CityId
                                }

                                $scope.New.workReferences.push(wExperience);
                            }
                        }

                        if ($scope.personalReferences.length > 0) {
                            $scope.New.personalReferences = [];
                            for (var l = 0; l < $scope.personalReferences.length; l++) {
                                var pExperience = {
                                    FirstName: $scope.personalReferences[l].FirstName,
                                    LastName: $scope.personalReferences[l].LastName,
                                    Charge: $scope.personalReferences[l].Charge,
                                    Cellphone: $scope.personalReferences[l].Cellphone,
                                    Email: $scope.personalReferences[l].Email,
                                    CompanyName: $scope.personalReferences[l].CompanyName,
                                    Relationship: $scope.personalReferences[l].Relationship,
                                    ReferenceTypeId: 2,
                                    CityId: $scope.personalReferences[l].City.CityId
                                }

                                $scope.New.workReferences.push(pExperience);
                            }
                        }

                        if ($scope.Trannings.length > 0) {
                            for (var i = 0; i < $scope.Trannings.length; i++) {
                                var tranning = {
                                    Year: $scope.Trannings[i].Year,
                                    CountryId: $scope.Trannings[i].Country.CountryId,
                                    CityId: $scope.Trannings[i].City.CityId,
                                    TrainingName: $scope.Trannings[i].TrainingName,
                                    InstitutionName: $scope.Trannings[i].InstitutionName,
                                    CareerId: $scope.Trannings[i].CareerId,
                                    EducationTypeId: 2
                                };
                                $scope.New.AcademicEducations.push(tranning);
                            }
                        }

                        if ($scope.action == 'edit') {
                            customerRepository.UpdateCustomer($scope.New).success(function () {
                                alertService.add('success', 'Enhorabuena', 'Registro se ha actualizado correctamente.');
                                $scope.alertsTags = $rootScope.alerts;
                                $location.path("/AllClients");
                            }).error(function () {
                                alertService.add('danger', 'Error', 'No se ha podido actualizar el registro.');
                                $scope.alertsTags = $rootScope.alerts;
                            });
                            $scope.action = '';
                        } else {
                            $scope.Tracking = [{ TrackingTypeId: 1, StateId: 1 }];
                            customerRepository.InsertCustomer(function() {

                            }, $scope.New, $scope.Tracking).success(function () {
                                alertService.add('success', 'Enhorabuena', 'Registro se ha insertado correctamente.');
                                $scope.alertsTags = $rootScope.alerts;
                                $location.path("/AllClients");
                            }).error(function () {
                                alertService.add('danger', 'Error', 'No se ha podido insertar el registro.');
                                $scope.alertsTags = $rootScope.alerts;
                            });

                        }

                    } else {
                        alertService.add('danger', 'Error', 'Complete correctamente todos los campos.');
                        $scope.alertsTags = $rootScope.alerts;
                    }
                }
                $scope.selectedCustomer = function (id, customer) {
                    $scope.selectedClient = id;
                    if (customer)
                        $scope.Customer = customer;
                }
                $scope.disableCustomer = function (customer) {
                    customer.StateId = 6;
                    $scope.New = customer;
                    $scope.enableOrDisableCustomer('Deshabilitado', 'Se ha deshabilitado un cliente correctamente.');
                };

                $scope.enableCustomer = function (customer) {
                    customer.StateId = 1;
                    customer.Trackings[0].TrackingTypeId = 1;
                    $scope.action = 'edit';
                    $scope.New = customer;
                    $scope.enableOrDisableCustomer('Habilitado', 'Se ha habilitado un cliente correctamente.');
                };

                $scope.setRejectionDescription = function (description) {
                    $scope.RejectionDescription = description;
                };

                $scope.enableOrDisableCustomer = function (title, msg) {
                    customerRepository.UpdateCustomer($scope.New).success(function () {
                        alertService.add('success', title, msg);
                        $scope.alertsTags = $rootScope.alerts;
                        $scope.setData();
                    }).error(function () {
                        alertService.add('danger', 'Error', 'No se ha podido deshabilitar el cliente.');
                        $scope.alertsTags = $rootScope.alerts;
                    });
                }

                $scope.DeleteCustomer = function(id) {
                    customerRepository.DeleteCustomer(function() {
                    }, id).success(function() {
                        alertService.add('success', 'Enhorabuena', 'Registro eliminado.');
                        $scope.alertsTags = $rootScope.alerts;
                    }).error(function () {
                        alertService.add('danger', 'Error', 'No se ha podido eliminar el registro.');
                        $scope.alertsTags = $rootScope.alerts;
                    });

                };
            }]).
    directive('loading', function() {
        return {
            restrict: 'E',
            replace: true,
            template: '<div class="loading"><img src="../../Images/loading.gif" width="50" height="50" />CARGANDO...</div>',
            link: function(scope, element, attr) {
                scope.$watch('loading', function(val) {
                    if (val)
                        $(element).show();
                    else
                        $(element).hide();
                });
            }
        }
    })
    .controller('EnrollCustomerController', ['$scope', '$rootScope', '$location', '$filter', 'customerRepository', 'filterFilter', 'alertService', function ($scope, $rootScope, $location, $filter, customerRepository, filterFilter, alertService) {
        //enroll costumer
        $scope.enrollClientExist = false;
        $scope.showMsgErrorClient = false;
        if (!$rootScope.alerts)
            $rootScope.alerts = [];

        $scope.back = function () {
            $location.path("/AllClients");
        };

        //End Sorting//
        $scope.itemsPerPageList = [5, 10, 20, 30, 40, 50];
        $scope.entryLimit = $scope.itemsPerPageList[0];
        $scope.currentPage = 1; //current page
        $scope.setEnrollClients = function (term) {
            if (!term)
                $scope.load = true;
            customerRepository.getCustomers().success(function (data) {
                $scope.enrollCustomerData = $filter('filter')(data, { StateId: 1 }, true);
                $scope.totalServerItems = data.totalItems;
                $scope.items = data.items;
                $scope.load = false;

                if ($rootScope.alerts)
                    $scope.alertsTags = $rootScope.alerts;
                $scope.maxSize = 5; //pagination max size
                //max rows for data table

                /* init pagination with $scope.list */
                $scope.setEnrollClientFiltered(term);

            })
                    .error(function (data) {
                        alertService.add('danger', 'Error', 'No se han cargado los datos correctamente.');
                        $scope.alertsTags = $rootScope.alerts;
                        $scope.load = false;
                    });
        }
        $scope.setEnrollClientFiltered = function (term) {
            $scope.filtered = filterFilter($scope.enrollCustomerData, term);

            $scope.itemsInPage = ($scope.filtered.length) ? ((($scope.currentPage * $scope.entryLimit) > $scope.filtered.length) ?
                    $scope.filtered.length - (($scope.currentPage - 1) * $scope.entryLimit) : $scope.entryLimit) : 0;
            $scope.noOfPages = ($scope.filtered) ? Math.ceil($scope.filtered.length / $scope.entryLimit) : 1;
        };
    
        $scope.enrollClient_ClearData = function () {
            enrollClient_cancel();
            $scope.showMsgErrorClient = false;
        };

        $scope.enrollClient_cancel = function () {
            $scope.saveEnrollClient('reject');
            $scope.enrollClientExist = false;
            $scope.enrollClient = null;
        }

        $scope.searchClient = function (enrollClient) {
            $scope.load = true;
            $scope.personalReferencesEnroll = [];
            $scope.enrollClientExist = false;
            for (var j = 0; j < enrollClient.References.length; j++) {
                if (enrollClient.References[j].ReferenceType.Name != 'L')
                    $scope.personalReferencesEnroll.push(enrollClient.References[j]);
            }
            $scope.enrollClient = angular.copy(enrollClient);
            $scope.load = false;
            $scope.enrollClientExist = true;
           /* customerRepository.getCustomers().success(function (data) {
                $scope.customer = data;
                $scope.enrollClientExist = false;
                $scope.personalReferencesEnroll = [];
                for (var i = 0; i < data.length; i++) {
                    if (data[i].FirstName.toUpperCase() == enrollClient.FirstName.toUpperCase() && data[i].LastName.toUpperCase() == enrollClient.LastName.toUpperCase()) {
                        $scope.enrollClientExist = true;
                        $scope.enrollClient = angular.copy(data[i]);
                        $scope.load = false;
                        $scope.showMsgErrorClient = false;

                        for (var j = 0; j < data[i].References.length; j++) {
                            if (data[i].References[j].ReferenceType.Name != 'L')
                                $scope.personalReferencesEnroll.push(data[i].References[j]);
                        }

                        break;
                    }
                }
                $scope.totalServerItems = data.totalItems;
                $scope.items = data.items;
                $scope.load = false;
                $scope.showMsgErrorClient = true;
            })
            .error(function (data) {
                alertService.add('danger', 'Error', 'No se han cargado los datos correctamente.');
                $scope.alertsTags = $rootScope.alerts;
                $scope.load = false;
            });*/
        };

        $scope.saveEnrollClient = function (action) {
            $scope.enrollClient.StateId = (action == 'reject') ? 3 : 2;
            $scope.enrollClient.Approved = (action == 'reject') ? 0 : 1;
            $scope.enrollClient.State = null;
            if ($scope.enrollClientForm.$valid || $scope.formReject.$valid && action == 'reject') {
                if ($scope.personalReferencesEnroll)
                    $scope.enrollClient.References = $scope.personalReferencesEnroll;
                customerRepository.inscribeCustomer($scope.enrollClient).success(function () {
                    alertService.add('success', 'Enhorabuena', 'Un nuevo cliente ha sido inscrito.');
                    $scope.alertsTags = $rootScope.alerts;
                    $scope.enrollClientExist = false;
                    $scope.setEnrollClients();
                }).error(function () {
                    alertService.add('danger', 'Error', 'No se ha podido inscribir el cliente.');
                    $scope.alertsTags = $rootScope.alerts;
                    $scope.load = false;
                });
            } else {
                alertService.add('danger', 'Error', 'Complete todos los campos correctamente.');
                $scope.alertsTags = $rootScope.alerts;
            }
        };

        $scope.insertPersonalReference = function () {
            if ($scope.formPersonalRef.$valid) {
                if ($scope.action == 'edit') {
                    $scope.personalReferencesEnroll[index] = $scope.Reference;
                } else {
                    $scope.Reference.ClientId = $scope.enrollClient.ClientId;
                    $scope.Reference.ReferenceTypeId = 2;
                    //$scope.Reference.CityId = $scope.City.CityId;
                    $scope.personalReferencesEnroll.push($scope.Reference);
                    alertService.add('success', 'Enhorabuena', 'Registro agregado correctamente.');
                    $scope.alertsTags = $rootScope.alerts;
                }
            } else {
                alertService.add('danger', 'Error', 'Complete todos los campos correctamente.');
                $scope.alertsTags = $rootScope.alerts;
            }
        };
    

        /*PersonalReference*/
        $scope.clearPersonalReferenceEnrollClient = function () {
            $scope.textButton = 'Agregar';
            if ($scope.Reference) {
                $scope.Reference = undefined;
                $scope.action = '';
                $scope.index = -1;
            }
        };
        $scope.setReference = function (reference) {
            $scope.Reference = reference;
            $scope.action = 'editar';
            $scope.textButton = 'Editar';
        }
        $scope.deletePReference = function (index) {
            $scope.personalReferencesEnroll.splice(index, 1);
            alertService.add('success', 'Eliminado', 'Registro se ha eliminado correctamente.');
            $scope.alertsTags = $rootScope.alerts;
        }

     

        $scope.$watch('search', function (term) {
                $scope.setEnrollClients();

        });

       

        customerRepository.getCareers().success(function (data) {
            $scope.AllCarees = data;
        });

        customerRepository.getCities().success(function(data) {
            $scope.Cities = data;
        });
        customerRepository.getCountries().success(function(data) {
            $scope.Countries = data;
        });
        customerRepository.getAcademicLevels().success(function(data) {

            $scope.AcademicLevels = data;
        });
        customerRepository.getEducationTypes().success(function(data) {

            $scope.EducationTypes = data;
        });
        customerRepository.getLanguages().success(function(data) {

            $scope.Languages = data;
        });
        customerRepository.getLanguageLevels().success(function(data) {

            $scope.LanguageLevels = data;
        });
        $scope.getStates = function () {
            customerRepository.getStates().success(function (data) {
                $scope.States = data;
                $scope.selecteds = {};
                angular.forEach($scope.States, function (value, key) {
                    $scope.selecteds[key] = value[0];
                });
            });
        };
                
       
        $scope.getCitiesByCountry = function(countryId) {
            if (countryId)
                return $filter('filter')($scope.Countries, { CountryId: countryId })[0].Cities;
        };             
    }])
    .controller("editCustomerController", ['$scope', '$rootScope', '$routeParams', '$location', '$filter', 'customerRepository', function ($scope, $rootScope, $routeParams, $location, $filter, customerRepository) {
            $rootScope.alerts = [];

            $scope.back = function () {
                $location.path("/AllClients");
            }
                $scope.calculateAge = function() {
                    var birthday = +new Date($scope.New.Birthday);
                    var age = ~~((Date.now() - birthday) / (31557600000));
                    $scope.New.Age = age;
                }
            $scope.handleFileSelectAdd = function (evt) {
                var f = evt.target.files[0];
                var reader = new FileReader();
                reader.onload = (function (theFile) {
                    return function (e) {
                    var filePayload = e.target.result;
                    $scope.New.Photo = filePayload.replace('data:'+f.type +';base64,', '');
                    $scope.$apply(function(){
                        
                    }); 
                    };
                })(f);
                reader.readAsDataURL(f);
            };
        
        var imageElement = document.getElementById('exampleInputFile');
            if (imageElement)
                imageElement.addEventListener('change', $scope.handleFileSelectAdd, false);
                
            customerRepository.getCustomer($routeParams.id).success(function (data) {
            $scope.academicEducations = [],
            $scope.knownLaguages = [],
            $scope.knownPrograms = [],
            $scope.personalReferences = [],
            $scope.workReferences = [],
            $scope.workExperiences = [];
            $scope.Trannings =[];   
                if (data.Birthday)
                    data.Birthday = new Date(data.Birthday);
                $scope.academicEducations = [];
                var educations = data.AcademicEducations;
                $scope.knownLanguages = data.Languages;
                $scope.knownPrograms = data.KnownPrograms;
                $scope.workExperiences = data.WorkExperiences;
                $scope.Trannings = [];
                $scope.workReferences = [],
                    $scope.personalReferences = [];
                for (var j = 0; j < data.AcademicEducations.length; j++) {
                    if (data.AcademicEducations[j].EducationType.Name == 'ACADEMICA') {
                        $scope.academicEducations.push(data.AcademicEducations[j]);
                    } else {
                        $scope.Trannings.push(data.AcademicEducations[j]);
                    }
                }
                for (var i = 0; i < data.References.length; i++) {
                    if (data.References[i].ReferenceType.Name == 'L')
                        $scope.workReferences.push(data.References[i]);
                    else
                        $scope.personalReferences.push(data.References[i]);
                }

                $scope.New = data;
       
            });
            
            $scope.index = -1;
            $scope.action = '';
            $scope.load = true;

            $scope.addAcademicEducation = function () {
                if ($scope.academicFormEdit.$valid) {
                    var index = $scope.countryIndex;
                    if ($scope.action == 'edit') {
                        $scope.academicEducations[$scope.index].TrainingName = $scope.TrainingName,
                            $scope.academicEducations[$scope.index].InstitutionName = $scope.InstitutionName,
                            $scope.academicEducations[$scope.index].AcademicLevel = $filter('filter')($scope.AcademicLevels, { AcademicLevelId: $scope.AcademicLevelId })[0],
                            $scope.academicEducations[$scope.index].AcademicLevelId = $scope.AcademicLevelId,
                            $scope.academicEducations[$scope.index].CareerId = $scope.CareerId,
                            $scope.academicEducations[$scope.index].EducationTypeId = $scope.EducationTypeId,
                            $scope.academicEducations[$scope.index].City = $filter('filter')($scope.Cities, { CityId: $scope.CityId })[0],
                            $scope.academicEducations[$scope.index].CityId = $scope.CityId,
                            $scope.academicEducations[$scope.index].Year = $scope.Year,
                            $scope.academicEducations[$scope.index].Country = $filter('filter')($scope.Countries, { CountryId: $scope.CountryId })[0],
                            $scope.academicEducations[$scope.index].CountryId = $scope.CountryId;
                        alertService.add('success', 'Enhorabuena', 'Registro se ha actualizado correctamente.');
                        $scope.alertsTags = $rootScope.alerts;
                    } else {
                        var education = {
                            TrainingName: $scope.TrainingName,
                            InstitutionName: $scope.InstitutionName,
                            AcademicLevelId: $scope.AcademicLevelId,
                            AcademicLevel: $filter('filter')($scope.AcademicLevels, { AcademicLevelId: $scope.AcademicLevelId })[0],
                            CareerId: $scope.CareerId,
                            EducationTypeId: $scope.EducationTypeId,
                            CityId: $scope.CityId,
                            City: $filter('filter')($scope.Cities, { CityId: $scope.CityId })[0],
                            Year: $scope.Year,
                            CountryId: $scope.CountryId,
                            Country: $filter('filter')($scope.Countries, { CountryId: $scope.CountryId })[0]
                        };
                        $scope.academicEducations.push(education);
                        alertService.add('success', 'Enhorabuena', 'Registro se ha insertado correctamente.');
                        $scope.alertsTags = $rootScope.alerts;
                    }
                    $scope.action = '';
                    $scope.index = -1;
                } else {
                    alertService.add('danger', 'Error', 'Complete todos los campos correctamente.');
                    $scope.alertsTags = $rootScope.alerts;
                }
            };

            $scope.fillAcademicEducation = function (index) {
                $scope.textButton = 'Editar';
                $scope.TrainingName = $scope.academicEducations[index].TrainingName,
                    $scope.InstitutionName = $scope.academicEducations[index].InstitutionName,
                    $scope.AcademicLevelId = $scope.academicEducations[index].AcademicLevel.AcademicLevelId,
                    $scope.Careers = $scope.academicEducations[index].AcademicLevel.Careers,
                    $scope.CareerId = $scope.academicEducations[index].CareerId,
                    $scope.EducationTypeId = $scope.academicEducations[index].EducationTypeId,
                    $scope.CityId = $scope.academicEducations[index].CityId,
                    $scope.Year = $scope.academicEducations[index].Year,
                    $scope.CountryId = $scope.academicEducations[index].City.CountryId;
                $scope.action = 'edit';
                $scope.index = index;
            }
            $scope.clearAcademicEducation = function () {
                $scope.textButton = 'Agregar';
                $scope.TrainingName = "",
                $scope.InstitutionName = "",
                $scope.AcademicLevelId = "",
                $scope.EducationTypeId = "";
                $scope.CityId = "",
                $scope.Year = "",
                $scope.CountryId = "";
                $scope.action = "";
            };
            $scope.removeAcademicEducation = function (index) {
                $scope.academicEducations.splice(index, 1);
                alertService.add('success', 'Enhorabuena', 'Registro se ha eliminado correctamente.');
                $scope.alertsTags = $rootScope.alerts;
            };

            /*Languages*/
            $scope.clearKnownLanguage = function () {
                $scope.textButton = 'Agregar';
                $scope.Percentage = "",
                $scope.LanguageId = "",
                $scope.LanguageLevelId = "";
                $scope.action = '';
                $scope.index = -1;
            };
            $scope.fillKnownLanguage = function (index) {
                $scope.textButton = 'Editar';
                $scope.Percentage = $scope.knownLanguages[index].Percentage,
                $scope.LanguageId = $scope.knownLanguages[index].LanguageId,
                $scope.LanguageLevelId = $scope.knownLanguages[index].LanguageLevelId;
                $scope.action = 'edit';
                $scope.index = index;
            };
            $scope.addKnownLanguage = function () {
                if ($scope.languageFormEdit.$valid) {
                    if ($scope.action == 'edit') {
                        $scope.knownLanguages[$scope.index].Percentage = $scope.Percentage,
                            $scope.knownLanguages[$scope.index].Language = $filter('filter')($scope.Languages, { LanguageId: $scope.LanguageId })[0],
                            $scope.knownLanguages[$scope.index].LanguageId = $scope.LanguageId,
                            $scope.knownLanguages[$scope.index].LanguageLevel = $filter('filter')($scope.LanguageLevels, { LanguageLevelId: $scope.LanguageLevelId })[0],
                            $scope.knownLanguages[$scope.index].LanguageLevelId = $scope.LanguageLevelId;
                        alertService.add('success', 'Enhorabuena', 'Registro se ha actualizado correctamente.');
                        $scope.alertsTags = $rootScope.alerts;
                    } else {
                        var lang = {
                            Percentage: $scope.Percentage,
                            Language: $filter('filter')($scope.Languages, { LanguageId: $scope.LanguageId })[0],
                            LanguageId: $scope.LanguageId,
                            LanguageLevel: $filter('filter')($scope.LanguageLevels, { LanguageLevelId: $scope.LanguageLevelId })[0],
                            LanguageLevelId: $scope.LanguageLevelId
                        };
                        $scope.knownLanguages.push(lang);
                        $scope.clearKnownLanguage();
                        alertService.add('success', 'Enhorabuena', 'Registro se ha insertado correctamente.');
                        $scope.alertsTags = $rootScope.alerts;
                    }
                } else {
                    alertService.add('danger', 'Error', 'Complete todos los campos correctamente.');
                    $scope.alertsTags = $rootScope.alerts;
                }
            };
            $scope.removeKnownLanguage = function (index) {
                $scope.knownLanguages.splice(index, 1);
                alertService.add('success', 'Enhorabuena', 'Registro se ha eliminado correctamente.');
                $scope.alertsTags = $rootScope.alerts;
            };

            /*Programs*/
            $scope.clearProgram = function () {
                $scope.textButton = 'Agregar';
                $scope.NameProgram = "";
                $scope.action = '';
                $scope.index = -1;
            };
            $scope.fillKnownProgram = function (index) {
                $scope.textButton = 'Editar';
                $scope.NameProgram = $scope.knownPrograms[index].Name;
                $scope.action = 'edit';
                $scope.index = index;
            };
            $scope.addKnownProgram = function () {
                if ($scope.programFormEdit.$valid) {
                    if ($scope.action == 'edit') {
                        $scope.knownPrograms[$scope.index].Name = $scope.NameProgram;
                        alertService.add('success', 'Enhorabuena', 'Registro se ha actualizado correctamente.');
                        $scope.alertsTags = $rootScope.alerts;
                    } else {
                        var program = {
                            Name: $scope.NameProgram
                        };
                        $scope.knownPrograms.push(program);
                        $scope.clearProgram();
                        alertService.add('success', 'Enhorabuena', 'Registro se ha insertado correctamente.');
                        $scope.alertsTags = $rootScope.alerts;
                    }
                } else {
                    alertService.add('danger', 'Error', 'Complete todos los campos correctamente.');
                    $scope.alertsTags = $rootScope.alerts;
                }
            };
            $scope.removeKnownProgram = function (index) {
                $scope.knownPrograms.splice(index, 1);
                alertService.add('success', 'Enhorabuena', 'Registro se ha eliminado correctamente.');
                $scope.alertsTags = $rootScope.alerts;
            };

            /*WorkExperience*/
            $scope.clearWorkExperience = function () {
                $scope.textButton = 'Agregar';
                $scope.CompanyName = "";
                $scope.CompanyArea = "";
                $scope.Charge = "";
                $scope.StartDate = "";
                $scope.EndDate = "";
                $scope.Achievements = "";
                $scope.WorkCountryId = "";
                $scope.WorkCityId = "";
                $scope.action = '';
                $scope.index = -1;
            };
            $scope.fillWorkExperience = function (index) {
                $scope.textButton = 'Editar';
                $scope.CompanyName = $scope.workExperiences[index].CompanyName,
                    $scope.CompanyArea = $scope.workExperiences[index].CompanyArea,
                    $scope.Charge = $scope.workExperiences[index].Charge,
                    $scope.StartDate = new Date($scope.workExperiences[index].StartDate),
                    $scope.EndDate = new Date($scope.workExperiences[index].EndDate),
                    $scope.Achievements = $scope.workExperiences[index].Archievements,
                    $scope.WorkCityId = $scope.workExperiences[index].CityId,
                    $scope.WorkCountryId = $scope.workExperiences[index].City.CountryId;
                $scope.action = 'edit';
                $scope.index = index;
            };
            $scope.addWorkExperience = function () {
                if ($scope.workExperienceFormEdit.$valid) {
                    if ($scope.action == 'edit') {
                        $scope.workExperiences[$scope.index].CompanyName = $scope.CompanyName,
                            $scope.workExperiences[$scope.index].CompanyArea = $scope.CompanyArea,
                            $scope.workExperiences[$scope.index].Charge = $scope.Charge,
                            $scope.workExperiences[$scope.index].StartDate = $scope.StartDate,
                            $scope.workExperiences[$scope.index].EndDate = $scope.EndDate,
                            $scope.workExperiences[$scope.index].Archievements = $scope.Achievements,
                            $scope.workExperiences[$scope.index].City = $filter('filter')($scope.Cities, { CityId: $scope.WorkCityId })[0],
                            $scope.workExperiences[$scope.index].CityId = $scope.WorkCityId,
                            $scope.workExperiences[$scope.index].Country = $filter('filter')($scope.Countries, { CountryId: $scope.WorkCountryId })[0],
                            $scope.workExperiences[$scope.index].CountryId = $scope.WorkCountryId;
                        alertService.add('success', 'Enhorabuena', 'Registro se ha actualizado correctamente.');
                        $scope.alertsTags = $rootScope.alerts;
                    } else {
                        var experience = {
                            CompanyName: $scope.CompanyName,
                            CompanyArea: $scope.CompanyArea,
                            Charge: $scope.Charge,
                            StartDate: $scope.StartDate,
                            EndDate: $scope.EndDate,
                            Achievements: $scope.Achievements,
                            City: $filter('filter')($scope.Cities, { CityId: $scope.WorkCityId })[0],
                            CityId: $scope.WorkCityId,
                            Country: $filter('filter')($scope.Countries, { CountryId: $scope.WorkCountryId })[0],
                            CountryId: $scope.WorkCountryId
                        };
                        $scope.workExperiences.push(experience);
                        $scope.clearWorkExperience();
                        alertService.add('success', 'Enhorabuena', 'Registro se ha insertado correctamente.');
                        $scope.alertsTags = $rootScope.alerts;
                    }
                } else {
                    alertService.add('danger', 'Error', 'Complete todos los campos correctamente.');
                    $scope.alertsTags = $rootScope.alerts;
                }
            };
            $scope.removeWorkExperience = function (index) {
                $scope.workExperiences.splice(index, 1);
                alertService.add('success', 'Enhorabuena', 'Registro se ha eliminado correctamente.');
                $scope.alertsTags = $rootScope.alerts;
            };

            /*WorkReference*/
            $scope.clearWorkReference = function () {
                $scope.textButton = "Agregar";
                $scope.FirstNameWRef = "";
                $scope.LastNameWRef = "";
                $scope.ChargeWRef = "";
                $scope.CellphoneWRef = "";
                $scope.EmailWRef = "";
                $scope.CompanyNameWRef = "";
                $scope.RelationshipWRef = "";
                $scope.CityWRef = "";
                $scope.CountryWRef = "";
                $scope.action = '';
                $scope.index = -1;
            };
            $scope.fillWorkReference = function (index) {
                $scope.textButton = 'Editar';
                $scope.FirstNameWRef = $scope.workReferences[index].FirstName,
                    $scope.LastNameWRef = $scope.workReferences[index].LastName,
                    $scope.ChargeWRef = $scope.workReferences[index].Charge,
                    $scope.CellphoneWRef = $scope.workReferences[index].Cellphone,
                    $scope.EmailWRef = $scope.workReferences[index].Email,
                    $scope.CompanyNameWRef = $scope.workReferences[index].CompanyName,
                    $scope.RelationshipWRef = $scope.workReferences[index].Relationship,
                    $scope.CityIdWRef = $scope.workReferences[index].City.CityId,
                    $scope.CountryIdWRef = $scope.workReferences[index].City.Country.CountryId;
                $scope.action = 'edit';
                $scope.index = index;
            };
            $scope.addWorkReference = function () {
                if ($scope.workReferenceFormEdit.$valid) {
                    if ($scope.action == 'edit') {
                        $scope.workReferences[$scope.index].FirstName = $scope.FirstNameWRef,
                            $scope.workReferences[$scope.index].LastName = $scope.LastNameWRef,
                            $scope.workReferences[$scope.index].Charge = $scope.ChargeWRef,
                            $scope.workReferences[$scope.index].Cellphone = $scope.CellphoneWRef,
                            $scope.workReferences[$scope.index].Email = $scope.EmailWRef,
                            $scope.workReferences[$scope.index].CompanyName = $scope.CompanyNameWRef,
                            $scope.workReferences[$scope.index].Relationship = $scope.RelationshipWRef,
                            $scope.workReferences[$scope.index].City = $filter('filter')($scope.Cities, { CityId: $scope.CityIdWRef })[0],
                            $scope.workReferences[$scope.index].CityId = $scope.CityIdWRef,
                            $scope.workReferences[$scope.index].Country = $filter('filter')($scope.Cities, { CountryId: $scope.CountryIdWRef })[0],
                            $scope.workReferences[$scope.index].CountryId = $scope.CountryIdWRef;

                        alertService.add('success', 'Enhorabuena', 'Registro se ha actualizado correctamente.');
                        $scope.alertsTags = $rootScope.alerts;
                    } else {
                        var wReference = {
                            FirstName: $scope.FirstNameWRef,
                            LastName: $scope.LastNameWRef,
                            Charge: $scope.ChargeWRef,
                            Cellphone: $scope.CellphoneWRef,
                            Email: $scope.EmailWRef,
                            CompanyName: $scope.CompanyNameWRef,
                            Relationship: $scope.RelationshipWRef,
                            City: $filter('filter')($scope.Cities, { CityId: $scope.CityIdWRef })[0],
                            CityId: $scope.CityIdWRef,
                            Country: $filter('filter')($scope.Cities, { CountryId: $scope.CountryIdWRef })[0],
                            CountryId: $scope.CountryIdWRef
                        };
                        $scope.workReferences.push(wReference);
                        $scope.clearWorkReference();

                        alertService.add('success', 'Enhorabuena', 'Registro se ha insertado correctamente.');
                        $scope.alertsTags = $rootScope.alerts;
                    }
                } else {
                    alertService.add('danger', 'Error', 'Complete todos los campos correctamente.');
                    $scope.alertsTags = $rootScope.alerts;
                }
            };
            $scope.removeWorkReference = function (index) {
                $scope.workReferences.splice(index, 1);
                alertService.add('success', 'Enhorabuena', 'Registro se ha eliminado correctamente.');
                $scope.alertsTags = $rootScope.alerts;
            };

            /*PersonalReference*/
            $scope.clearPersonalReference = function () {
                $scope.textButton = 'Agregar';
                $scope.FirstNamePRef = "";
                $scope.LastNamePRef = "";
                $scope.ChargePRef = "";
                $scope.CellphonePRef = "";
                $scope.EmailPRef = "";
                $scope.CompanyNamePRef = "";
                $scope.RelationshipPRef = "";
                $scope.CityIdPRef = "";
                $scope.CountryIdPRef = "";
                $scope.action = '';
                $scope.index = -1;
            };
            $scope.fillPersonalReference = function (index) {
                $scope.textButton = 'Editar';
                $scope.FirstNamePRef = $scope.personalReferences[index].FirstName,
                    $scope.LastNamePRef = $scope.personalReferences[index].LastName,
                    $scope.ChargePRef = $scope.personalReferences[index].Charge,
                    $scope.CellphonePRef = $scope.personalReferences[index].Cellphone,
                    $scope.EmailPRef = $scope.personalReferences[index].Email,
                    $scope.CompanyNamePRef = $scope.personalReferences[index].CompanyName,
                    $scope.RelationshipPRef = $scope.personalReferences[index].Relationship,
                    $scope.CityIdPRef = $scope.personalReferences[index].CityId,
                    $scope.CountryIdPRef = $scope.personalReferences[index].City.CountryId;
                $scope.action = 'edit';
                $scope.index = index;
            };
            $scope.addPersonalReference = function () {
                if ($scope.personalReferenceFormEdit) {
                    if ($scope.action == 'edit') {
                        $scope.personalReferences[$scope.index].FirstName = $scope.FirstNamePRef,
                            $scope.personalReferences[$scope.index].LastName = $scope.LastNamePRef,
                            $scope.personalReferences[$scope.index].Charge = $scope.ChargePRef,
                            $scope.personalReferences[$scope.index].Cellphone = $scope.CellphonePRef,
                            $scope.personalReferences[$scope.index].Email = $scope.EmailPRef,
                            $scope.personalReferences[$scope.index].CompanyName = $scope.CompanyNamePRef,
                            $scope.personalReferences[$scope.index].Relationship = $scope.RelationshipPRef,
                            $scope.personalReferences[$scope.index].CityId = $scope.CityIdPRef,
                            $scope.personalReferences[$scope.index].City = $filter('filter')($scope.Cities, { CityId: $scope.CityPRef })[0],
                            $scope.personalReferences[$scope.index].CountryId = $scope.CountryIdPRef,
                            $scope.personalReferences[$scope.index].Country = $filter('filter')($scope.Countries, { CountryId: $scope.CountryIdPRef })[0];

                        alertService.add('success', 'Enhorabuena', 'Registro se ha actualizado correctamente.');
                        $scope.alertsTags = $rootScope.alerts;
                    } else {
                        var pReference = {
                            FirstName: $scope.FirstNamePRef,
                            LastName: $scope.LastNamePRef,
                            Charge: $scope.ChargePRef,
                            Cellphone: $scope.CellphonePRef,
                            Email: $scope.EmailPRef,
                            CompanyName: $scope.CompanyNamePRef,
                            Relationship: $scope.RelationshipPRef,
                            CityId: $scope.CityIdPRef,
                            City: $filter('filter')($scope.Cities, { CityId: $scope.CityPRef })[0],
                            CountryId: $scope.CountryIdPRef,
                            Country: $filter('filter')($scope.Countries, { CountryId: $scope.CountryIdPRef })[0]
                        };
                        $scope.personalReferences.push(pReference);
                        $scope.clearPersonalReference();

                        alertService.add('success', 'Enhorabuena', 'Registro se ha insertado correctamente.');
                        $scope.alertsTags = $rootScope.alerts;
                    }
                } else {
                    alertService.add('danger', 'Error', 'Complete todos los campos correctamente.');
                    $scope.alertsTags = $rootScope.alerts;
                }
            };
            $scope.removePersonalReference = function (index) {
                $scope.personalReferences.splice(index, 1);
                alertService.add('success', 'Enhorabuena', 'Registro se ha eliminado correctamente.');
                $scope.alertsTags = $rootScope.alerts;
            };
           
            /*Tranning*/
            $scope.clearTranning = function () {
                $scope.textButton = 'Agregar';
                $scope._TrainingName = "",
                    $scope._InstitutionName = "",
                    $scope._AcademicLevel = "",
                    $scope._EducationTypeId = "",
                    $scope._CityId = "",
                    $scope._Year = "",
                    $scope._CountryId = "";
                $scope.action = '';
                $scope.index = -1;
            };
            $scope.fillTranning = function (index) {
                $scope.textButton = "Editar";
                $scope._TrainingName = $scope.Trannings[index].TrainingName,
                    $scope._InstitutionName = $scope.Trannings[index].InstitutionName,
                    $scope._CareerId = $scope.Trannings[index].CareerId,
                    $scope._EducationTypeId = $scope.Trannings[index].EducationTypeId,
                    $scope._CityId = $scope.Trannings[index].CityId,
                    $scope._Year = $scope.Trannings[index].Year,
                    $scope._CountryId = $scope.Trannings[index].City.CountryId;
                $scope.action = 'edit';
                $scope.index = index;
            };
            $scope.addTranning = function () {
                if ($scope.trainingFormEdit.$valid) {
                    if ($scope.action == 'edit') {
                        $scope.Trannings[$scope.index].TrainingName = $scope._TrainingName;
                        $scope.Trannings[$scope.index].InstitutionName = $scope._InstitutionName;
                        $scope.Trannings[$scope.index].Career = $filter('filter')($scope.AllCarees, { CareerId: $scope._CareerId })[0];
                        $scope.Trannings[$scope.index].CareerId = $scope._CareerId;
                        $scope.Trannings[$scope.index].EducationTypeId = $scope._EducationTypeId;
                        $scope.Trannings[$scope.index].City = $filter('filter')($scope.Cities, { CityId: $scope._CityId })[0];
                        $scope.Trannings[$scope.index].CityId = $scope._CityId;
                        $scope.Trannings[$scope.index].Year = $scope._Year;
                        $scope.Trannings[$scope.index].Country = $filter('filter')($scope.Countries, { CountryId: $scope._CountryId })[0];
                        $scope.Trannings[$scope.index].CountryId = $scope._CountryId;

                        alertService.add('success', 'Enhorabuena', 'Registro se ha actualizado correctamente.');
                        $scope.alertsTags = $rootScope.alerts;
                    } else {
                        var tranning = {
                            TrainingName: $scope._TrainingName,
                            InstitutionName: $scope._InstitutionName,
                            Career: $filter('filter')($scope.AllCarees, { CareerId: $scope._CareerId })[0],
                            CareerId: $scope._CareerId,
                            EducationTypeId: $scope._EducationTypeId,
                            City: $filter('filter')($scope.Cities, { CityId: $scope._CityId })[0],
                            CityId: $scope._CityId,
                            Year: $scope._Year,
                            Country: $filter('filter')($scope.Countries, { CountryId: $scope._CountryId })[0],
                            CountryId: $scope._CountryId
                        };
                        if (!$scope.Trannings)
                            $scope.Trannings = [];

                        $scope.Trannings.push(tranning);
                        $scope.clearTranning();
                        alertService.add('success', 'Enhorabuena', 'Registro se ha insertado correctamente.');
                        $scope.alertsTags = $rootScope.alerts;
                    }
                } else {
                    alertService.add('danger', 'Error', 'Complete todos los campos correctamente.');
                    $scope.alertsTags = $rootScope.alerts;
                }
            };
            $scope.removeTranning = function (index) {
                $scope.Trannings.splice(index, 1);
                alertService.add('success', 'Enhorabuena', 'Registro se ha eliminado correctamente.');
                $scope.alertsTags = $rootScope.alerts;
            };

            customerRepository.getCities().success(function (data) {
                $scope.Cities = data;
            });
            customerRepository.getCareers().success(function (data) {
                $scope.AllCarees = data;
            });
            customerRepository.getCountries().success(function (data) {
                $scope.Countries = data;
            });
            customerRepository.getAcademicLevels().success(function (data) {

                $scope.AcademicLevels = data;
            });
            customerRepository.getEducationTypes().success(function (data) {

                $scope.EducationTypes = data;
            });
            customerRepository.getLanguages().success(function (data) {

                $scope.Languages = data;
            });
            customerRepository.getLanguageLevels().success(function (data) {

                $scope.LanguageLevels = data;
            });


        $scope.getCareersByAcademicLevel = function(academicLevelId) {
            for (var i = 0; i < $scope.AcademicLevels.length; i++) {
                var id = $scope.AcademicLevels[i].AcademicLevelId;
                if (academicLevelId.AcademicLevelId == id)
                    return $scope.AcademicLevels[i].Careers;
            }
        };

        $scope.getCitiesByCountry = function (countryId) {
            if (countryId)
                return $filter('filter')($scope.Countries, { CountryId: countryId })[0].Cities;
        };

            $scope.assignCareers = function () {
                if ($scope.AcademicLevelId)
                    $scope.Careers = $filter('filter')($scope.AcademicLevels, { AcademicLevelId: $scope.AcademicLevelId })[0].Careers;
            }

            $scope.update = function() {
                $scope.New.References = [];
                $scope.New.AcademicEducations = [];

                if ($scope.academicEducations.length > 0) {

                    for (var i = 0; i < $scope.academicEducations.length; i++) {
                        var academic = {
                            AcademicEducationId: ($scope.academicEducations[i].AcademicEducationId) ? $scope.academicEducations[i].AcademicEducationId : 0,
                            Year: $scope.academicEducations[i].Year,
                            CountryId: $scope.academicEducations[i].City.Country.CountryId,
                            CityId: $scope.academicEducations[i].City.CityId,
                            AcademicLevelId: $scope.academicEducations[i].AcademicLevel.AcademicLevelId,
                            TrainingName: $scope.academicEducations[i].TrainingName,
                            InstitutionName: $scope.academicEducations[i].InstitutionName,
                            CareerId: $scope.academicEducations[i].CareerId,
                            EducationTypeId: 1
                        };
                        $scope.New.AcademicEducations.push(academic);
                    }
                }
                if ($scope.Trannings.length > 0) {
                    for (var i = 0; i < $scope.Trannings.length; i++) {
                        var tranning = {
                            AcademicEducationId: ($scope.Trannings[i].AcademicEducationId) ? $scope.Trannings[i].AcademicEducationId : 0,
                            Year: $scope.Trannings[i].Year,
                            CountryId: $scope.Trannings[i].City.Country.CountryId,
                            CityId: $scope.Trannings[i].City.CityId,
                            TrainingName: $scope.Trannings[i].TrainingName,
                            InstitutionName: $scope.Trannings[i].InstitutionName,
                            CareerId: $scope.Trannings[i].CareerId,
                            EducationTypeId: 2
                        };
                        $scope.New.AcademicEducations.push(tranning);
                    }
                }
                if ($scope.workReferences.length > 0) {
                        for (var l = 0; l < $scope.workReferences.length; l++) {
                            var wExperience = {
                                ReferenceId: ($scope.workReferences[l].ReferenceId) ? $scope.workReferences[l].ReferenceId : 0,
                                FirstName: $scope.workReferences[l].FirstName,
                                LastName: $scope.workReferences[l].LastName,
                                Charge: $scope.workReferences[l].Charge,
                                Cellphone: $scope.workReferences[l].Cellphone,
                                Email: $scope.workReferences[l].Email,
                                CompanyName: $scope.workReferences[l].CompanyName,
                                Relationship: $scope.workReferences[l].Relationship,
                                ReferenceTypeId: 1,
                                CityId: $scope.workReferences[l].City.CityId
                            }

                            $scope.New.References.push(wExperience);
                        }
                    }

                    if ($scope.personalReferences.length > 0) {
                        for (var l = 0; l < $scope.personalReferences.length; l++) {
                            var pExperience = {
                                ReferenceId: ($scope.personalReferences[l].ReferenceId) ? $scope.personalReferences[l].ReferenceId : 0,
                                FirstName: $scope.personalReferences[l].FirstName,
                                LastName: $scope.personalReferences[l].LastName,
                                Charge: $scope.personalReferences[l].Charge,
                                Cellphone: $scope.personalReferences[l].Cellphone,
                                Email: $scope.personalReferences[l].Email,
                                CompanyName: $scope.personalReferences[l].CompanyName,
                                Relationship: $scope.personalReferences[l].Relationship,
                                ReferenceTypeId: 2,
                                CityId: $scope.personalReferences[l].City.CityId
                            }

                            $scope.New.References.push(pExperience);
                        }
                    }
                    if ($scope.editClientForm.$valid) {
                        customerRepository.UpdateCustomer($scope.New).success(function () {
                            alertService.add('success', 'Enhorabuena', 'Registro se ha actualizado correctamente.');
                            $scope.alertsTags = $rootScope.alerts;
                            $location.path("/AllClients");
                        }).error(function () {
                            alertService.add('danger', 'Error', 'No se ha podido actualizar el registro.');
                            $scope.alertsTags = $rootScope.alerts;
                        });
                    } else {
                        alertService.add('danger', 'Error', 'Complete correctamente todos los campos.');
                        $scope.alertsTags = $rootScope.alerts;
                    }
                
            }
        }
    ]).controller("CustomerTrackingController", ['$scope', '$rootScope', '$routeParams', '$location', '$filter', 'customerRepository', function ($scope, $rootScope, $routeParams, $location, $filter, customerRepository) {
        $rootScope.alerts = [];

        $scope.back = function () {
            $location.path("/AllClients");
        };

        $scope.calculateAge = function() {
            var birthday = +new Date($scope.New.Birthday);
            var age = ~~((Date.now() - birthday) / (31557600000));
            $scope.New.Age = age;
        }
        $scope.handleFileSelectAdd = function (evt) {
            var f = evt.target.files[0];
            var reader = new FileReader();
            reader.onload = (function (theFile) {
                return function (e) {
                    var filePayload = e.target.result;
                    $scope.New.Photo = filePayload.replace('data:'+f.type +';base64,', '');
                    $scope.$apply(function(){
                        
                    }); 
                };
            })(f);
            reader.readAsDataURL(f);
        };
        
        var imageElement = document.getElementById('exampleInputFile');
        if (imageElement)
            imageElement.addEventListener('change', $scope.handleFileSelectAdd, false);
                
        customerRepository.getCustomer($routeParams.id).success(function (data) {
            $scope.academicEducations = [],
            $scope.knownLaguages = [],
            $scope.knownPrograms = [],
            $scope.personalReferences = [],
            $scope.workReferences = [],
            $scope.workExperiences = [];
            $scope.Trannings = [];
            $scope.Trackings = [];
            if (data.Birthday)
                data.Birthday = new Date(data.Birthday);
            $scope.academicEducations = [];
            var educations = data.AcademicEducations;
            $scope.knownLanguages = data.Languages;
            $scope.knownPrograms = data.KnownPrograms;
            $scope.workExperiences = data.WorkExperiences;
            $scope.Trannings = [];
            $scope.workReferences = [],
                $scope.personalReferences = [];
            for (var j = 0; j < data.AcademicEducations.length; j++) {
                if (data.AcademicEducations[j].EducationType.Name == 'ACADEMICA') {
                    $scope.academicEducations.push(data.AcademicEducations[j]);
                } else {
                    $scope.Trannings.push(data.AcademicEducations[j]);
                }
            }
            for (var i = 0; i < data.References.length; i++) {
                if (data.References[i].ReferenceType.Name == 'L')
                    $scope.workReferences.push(data.References[i]);
                else
                    $scope.personalReferences.push(data.References[i]);
            }

            $scope.New = data;
       
        });

        /*Trackings*/
        $scope.clearTracking = function () {
            $scope.textButton = 'Agregar';
            $scope.NameProgram = "";
            $scope.action = '';
            $scope.index = -1;
        };
        $scope.fillTracking = function (index) {
            $scope.textButton = 'Editar';
            $scope.NameProgram = $scope.knownPrograms[index].Name;
            $scope.action = 'edit';
            $scope.index = index;
        };
        $scope.addTracking = function () {
            if ($scope.TrackingFormEdit.$valid) {
                if ($scope.action == 'edit') {
                    $scope.Trackings[$scope.index].Name = $scope.NameProgram;
                    alertService.add('success', 'Enhorabuena', 'Registro se ha actualizado correctamente.');
                    $scope.alertsTags = $rootScope.alerts;
                } else {
                    var program = {
                        Name: $scope.NameProgram
                    };
                    $scope.Tracking.push(program);
                    $scope.clearTracking();
                    alertService.add('success', 'Enhorabuena', 'Registro se ha insertado correctamente.');
                    $scope.alertsTags = $rootScope.alerts;
                }
            } else {
                alertService.add('danger', 'Error', 'Complete todos los campos correctamente.');
                $scope.alertsTags = $rootScope.alerts;
            }
        };
        $scope.removeTracking = function (index) {
            $scope.Tracking.splice(index, 1);
            alertService.add('success', 'Enhorabuena', 'Registro se ha eliminado correctamente.');
            $scope.alertsTags = $rootScope.alerts;
        };
            
        $scope.index = -1;
        $scope.action = '';
        $scope.load = true;

        $scope.addAcademicEducation = function () {
            if ($scope.academicFormEdit.$valid) {
                var index = $scope.countryIndex;
                if ($scope.action == 'edit') {
                    $scope.academicEducations[$scope.index].TrainingName = $scope.TrainingName,
                        $scope.academicEducations[$scope.index].InstitutionName = $scope.InstitutionName,
                        $scope.academicEducations[$scope.index].AcademicLevel = $filter('filter')($scope.AcademicLevels, { AcademicLevelId: $scope.AcademicLevelId })[0],
                        $scope.academicEducations[$scope.index].AcademicLevelId = $scope.AcademicLevelId,
                        $scope.academicEducations[$scope.index].CareerId = $scope.CareerId,
                        $scope.academicEducations[$scope.index].EducationTypeId = $scope.EducationTypeId,
                        $scope.academicEducations[$scope.index].City = $filter('filter')($scope.Cities, { CityId: $scope.CityId })[0],
                        $scope.academicEducations[$scope.index].CityId = $scope.CityId,
                        $scope.academicEducations[$scope.index].Year = $scope.Year,
                        $scope.academicEducations[$scope.index].Country = $filter('filter')($scope.Countries, { CountryId: $scope.CountryId })[0],
                        $scope.academicEducations[$scope.index].CountryId = $scope.CountryId;
                    alertService.add('success', 'Enhorabuena', 'Registro se ha actualizado correctamente.');
                    $scope.alertsTags = $rootScope.alerts;
                } else {
                    var education = {
                        TrainingName: $scope.TrainingName,
                        InstitutionName: $scope.InstitutionName,
                        AcademicLevelId: $scope.AcademicLevelId,
                        AcademicLevel: $filter('filter')($scope.AcademicLevels, { AcademicLevelId: $scope.AcademicLevelId })[0],
                        CareerId: $scope.CareerId,
                        EducationTypeId: $scope.EducationTypeId,
                        CityId: $scope.CityId,
                        City: $filter('filter')($scope.Cities, { CityId: $scope.CityId })[0],
                        Year: $scope.Year,
                        CountryId: $scope.CountryId,
                        Country: $filter('filter')($scope.Countries, { CountryId: $scope.CountryId })[0]
                    };
                    $scope.academicEducations.push(education);
                    alertService.add('success', 'Enhorabuena', 'Registro se ha insertado correctamente.');
                    $scope.alertsTags = $rootScope.alerts;
                }
                $scope.action = '';
                $scope.index = -1;
            } else {
                alertService.add('danger', 'Error', 'Complete todos los campos correctamente.');
                $scope.alertsTags = $rootScope.alerts;
            }
        };

        $scope.fillAcademicEducation = function (index) {
            $scope.textButton = 'Editar';
            $scope.TrainingName = $scope.academicEducations[index].TrainingName,
                $scope.InstitutionName = $scope.academicEducations[index].InstitutionName,
                $scope.AcademicLevelId = $scope.academicEducations[index].AcademicLevel.AcademicLevelId,
                $scope.Careers = $scope.academicEducations[index].AcademicLevel.Careers,
                $scope.CareerId = $scope.academicEducations[index].CareerId,
                $scope.EducationTypeId = $scope.academicEducations[index].EducationTypeId,
                $scope.CityId = $scope.academicEducations[index].CityId,
                $scope.Year = $scope.academicEducations[index].Year,
                $scope.CountryId = $scope.academicEducations[index].City.CountryId;
            $scope.action = 'edit';
            $scope.index = index;
        }
        $scope.clearAcademicEducation = function () {
            $scope.textButton = 'Agregar';
            $scope.TrainingName = "",
            $scope.InstitutionName = "",
            $scope.AcademicLevelId = "",
            $scope.EducationTypeId = "";
            $scope.CityId = "",
            $scope.Year = "",
            $scope.CountryId = "";
            $scope.action = "";
        };
        $scope.removeAcademicEducation = function (index) {
            $scope.academicEducations.splice(index, 1);
            alertService.add('success', 'Enhorabuena', 'Registro se ha eliminado correctamente.');
            $scope.alertsTags = $rootScope.alerts;
        };

        /*Languages*/
        $scope.clearKnownLanguage = function () {
            $scope.textButton = 'Agregar';
            $scope.Percentage = "",
            $scope.LanguageId = "",
            $scope.LanguageLevelId = "";
            $scope.action = '';
            $scope.index = -1;
        };
        $scope.fillKnownLanguage = function (index) {
            $scope.textButton = 'Editar';
            $scope.Percentage = $scope.knownLanguages[index].Percentage,
            $scope.LanguageId = $scope.knownLanguages[index].LanguageId,
            $scope.LanguageLevelId = $scope.knownLanguages[index].LanguageLevelId;
            $scope.action = 'edit';
            $scope.index = index;
        };
        $scope.addKnownLanguage = function () {
            if ($scope.languageFormEdit.$valid) {
                if ($scope.action == 'edit') {
                    $scope.knownLanguages[$scope.index].Percentage = $scope.Percentage,
                        $scope.knownLanguages[$scope.index].Language = $filter('filter')($scope.Languages, { LanguageId: $scope.LanguageId })[0],
                        $scope.knownLanguages[$scope.index].LanguageId = $scope.LanguageId,
                        $scope.knownLanguages[$scope.index].LanguageLevel = $filter('filter')($scope.LanguageLevels, { LanguageLevelId: $scope.LanguageLevelId })[0],
                        $scope.knownLanguages[$scope.index].LanguageLevelId = $scope.LanguageLevelId;
                    alertService.add('success', 'Enhorabuena', 'Registro se ha actualizado correctamente.');
                    $scope.alertsTags = $rootScope.alerts;
                } else {
                    var lang = {
                        Percentage: $scope.Percentage,
                        Language: $filter('filter')($scope.Languages, { LanguageId: $scope.LanguageId })[0],
                        LanguageId: $scope.LanguageId,
                        LanguageLevel: $filter('filter')($scope.LanguageLevels, { LanguageLevelId: $scope.LanguageLevelId })[0],
                        LanguageLevelId: $scope.LanguageLevelId
                    };
                    $scope.knownLanguages.push(lang);
                    $scope.clearKnownLanguage();
                    alertService.add('success', 'Enhorabuena', 'Registro se ha insertado correctamente.');
                    $scope.alertsTags = $rootScope.alerts;
                }
            } else {
                alertService.add('danger', 'Error', 'Complete todos los campos correctamente.');
                $scope.alertsTags = $rootScope.alerts;
            }
        };
        $scope.removeKnownLanguage = function (index) {
            $scope.knownLanguages.splice(index, 1);
            alertService.add('success', 'Enhorabuena', 'Registro se ha eliminado correctamente.');
            $scope.alertsTags = $rootScope.alerts;
        };

        /*Programs*/
        $scope.clearProgram = function () {
            $scope.textButton = 'Agregar';
            $scope.NameProgram = "";
            $scope.action = '';
            $scope.index = -1;
        };
        $scope.fillKnownProgram = function (index) {
            $scope.textButton = 'Editar';
            $scope.NameProgram = $scope.knownPrograms[index].Name;
            $scope.action = 'edit';
            $scope.index = index;
        };
        $scope.addKnownProgram = function () {
            if ($scope.programFormEdit.$valid) {
                if ($scope.action == 'edit') {
                    $scope.knownPrograms[$scope.index].Name = $scope.NameProgram;
                    alertService.add('success', 'Enhorabuena', 'Registro se ha actualizado correctamente.');
                    $scope.alertsTags = $rootScope.alerts;
                } else {
                    var program = {
                        Name: $scope.NameProgram
                    };
                    $scope.knownPrograms.push(program);
                    $scope.clearProgram();
                    alertService.add('success', 'Enhorabuena', 'Registro se ha insertado correctamente.');
                    $scope.alertsTags = $rootScope.alerts;
                }
            } else {
                alertService.add('danger', 'Error', 'Complete todos los campos correctamente.');
                $scope.alertsTags = $rootScope.alerts;
            }
        };
        $scope.removeKnownProgram = function (index) {
            $scope.knownPrograms.splice(index, 1);
            alertService.add('success', 'Enhorabuena', 'Registro se ha eliminado correctamente.');
            $scope.alertsTags = $rootScope.alerts;
        };

        /*WorkExperience*/
        $scope.clearWorkExperience = function () {
            $scope.textButton = 'Agregar';
            $scope.CompanyName = "";
            $scope.CompanyArea = "";
            $scope.Charge = "";
            $scope.StartDate = "";
            $scope.EndDate = "";
            $scope.Achievements = "";
            $scope.WorkCountryId = "";
            $scope.WorkCityId = "";
            $scope.action = '';
            $scope.index = -1;
        };
        $scope.fillWorkExperience = function (index) {
            $scope.textButton = 'Editar';
            $scope.CompanyName = $scope.workExperiences[index].CompanyName,
                $scope.CompanyArea = $scope.workExperiences[index].CompanyArea,
                $scope.Charge = $scope.workExperiences[index].Charge,
                $scope.StartDate = new Date($scope.workExperiences[index].StartDate),
                $scope.EndDate = new Date($scope.workExperiences[index].EndDate),
                $scope.Achievements = $scope.workExperiences[index].Archievements,
                $scope.WorkCityId = $scope.workExperiences[index].CityId,
                $scope.WorkCountryId = $scope.workExperiences[index].City.CountryId;
            $scope.action = 'edit';
            $scope.index = index;
        };
        $scope.addWorkExperience = function () {
            if ($scope.workExperienceFormEdit.$valid) {
                if ($scope.action == 'edit') {
                    $scope.workExperiences[$scope.index].CompanyName = $scope.CompanyName,
                        $scope.workExperiences[$scope.index].CompanyArea = $scope.CompanyArea,
                        $scope.workExperiences[$scope.index].Charge = $scope.Charge,
                        $scope.workExperiences[$scope.index].StartDate = $scope.StartDate,
                        $scope.workExperiences[$scope.index].EndDate = $scope.EndDate,
                        $scope.workExperiences[$scope.index].Archievements = $scope.Achievements,
                        $scope.workExperiences[$scope.index].City = $filter('filter')($scope.Cities, { CityId: $scope.WorkCityId })[0],
                        $scope.workExperiences[$scope.index].CityId = $scope.WorkCityId,
                        $scope.workExperiences[$scope.index].Country = $filter('filter')($scope.Countries, { CountryId: $scope.WorkCountryId })[0],
                        $scope.workExperiences[$scope.index].CountryId = $scope.WorkCountryId;
                    alertService.add('success', 'Enhorabuena', 'Registro se ha actualizado correctamente.');
                    $scope.alertsTags = $rootScope.alerts;
                } else {
                    var experience = {
                        CompanyName: $scope.CompanyName,
                        CompanyArea: $scope.CompanyArea,
                        Charge: $scope.Charge,
                        StartDate: $scope.StartDate,
                        EndDate: $scope.EndDate,
                        Achievements: $scope.Achievements,
                        City: $filter('filter')($scope.Cities, { CityId: $scope.WorkCityId })[0],
                        CityId: $scope.WorkCityId,
                        Country: $filter('filter')($scope.Countries, { CountryId: $scope.WorkCountryId })[0],
                        CountryId: $scope.WorkCountryId
                    };
                    $scope.workExperiences.push(experience);
                    $scope.clearWorkExperience();
                    alertService.add('success', 'Enhorabuena', 'Registro se ha insertado correctamente.');
                    $scope.alertsTags = $rootScope.alerts;
                }
            } else {
                alertService.add('danger', 'Error', 'Complete todos los campos correctamente.');
                $scope.alertsTags = $rootScope.alerts;
            }
        };
        $scope.removeWorkExperience = function (index) {
            $scope.workExperiences.splice(index, 1);
            alertService.add('success', 'Enhorabuena', 'Registro se ha eliminado correctamente.');
            $scope.alertsTags = $rootScope.alerts;
        };

        /*WorkReference*/
        $scope.clearWorkReference = function () {
            $scope.textButton = "Agregar";
            $scope.FirstNameWRef = "";
            $scope.LastNameWRef = "";
            $scope.ChargeWRef = "";
            $scope.CellphoneWRef = "";
            $scope.EmailWRef = "";
            $scope.CompanyNameWRef = "";
            $scope.RelationshipWRef = "";
            $scope.CityWRef = "";
            $scope.CountryWRef = "";
            $scope.action = '';
            $scope.index = -1;
        };
        $scope.fillWorkReference = function (index) {
            $scope.textButton = 'Editar';
            $scope.FirstNameWRef = $scope.workReferences[index].FirstName,
                $scope.LastNameWRef = $scope.workReferences[index].LastName,
                $scope.ChargeWRef = $scope.workReferences[index].Charge,
                $scope.CellphoneWRef = $scope.workReferences[index].Cellphone,
                $scope.EmailWRef = $scope.workReferences[index].Email,
                $scope.CompanyNameWRef = $scope.workReferences[index].CompanyName,
                $scope.RelationshipWRef = $scope.workReferences[index].Relationship,
                $scope.CityIdWRef = $scope.workReferences[index].City.CityId,
                $scope.CountryIdWRef = $scope.workReferences[index].City.Country.CountryId;
            $scope.action = 'edit';
            $scope.index = index;
        };
        $scope.addWorkReference = function () {
            if ($scope.workReferenceFormEdit.$valid) {
                if ($scope.action == 'edit') {
                    $scope.workReferences[$scope.index].FirstName = $scope.FirstNameWRef,
                        $scope.workReferences[$scope.index].LastName = $scope.LastNameWRef,
                        $scope.workReferences[$scope.index].Charge = $scope.ChargeWRef,
                        $scope.workReferences[$scope.index].Cellphone = $scope.CellphoneWRef,
                        $scope.workReferences[$scope.index].Email = $scope.EmailWRef,
                        $scope.workReferences[$scope.index].CompanyName = $scope.CompanyNameWRef,
                        $scope.workReferences[$scope.index].Relationship = $scope.RelationshipWRef,
                        $scope.workReferences[$scope.index].City = $filter('filter')($scope.Cities, { CityId: $scope.CityIdWRef })[0],
                        $scope.workReferences[$scope.index].CityId = $scope.CityIdWRef,
                        $scope.workReferences[$scope.index].Country = $filter('filter')($scope.Cities, { CountryId: $scope.CountryIdWRef })[0],
                        $scope.workReferences[$scope.index].CountryId = $scope.CountryIdWRef;

                    alertService.add('success', 'Enhorabuena', 'Registro se ha actualizado correctamente.');
                    $scope.alertsTags = $rootScope.alerts;
                } else {
                    var wReference = {
                        FirstName: $scope.FirstNameWRef,
                        LastName: $scope.LastNameWRef,
                        Charge: $scope.ChargeWRef,
                        Cellphone: $scope.CellphoneWRef,
                        Email: $scope.EmailWRef,
                        CompanyName: $scope.CompanyNameWRef,
                        Relationship: $scope.RelationshipWRef,
                        City: $filter('filter')($scope.Cities, { CityId: $scope.CityIdWRef })[0],
                        CityId: $scope.CityIdWRef,
                        Country: $filter('filter')($scope.Cities, { CountryId: $scope.CountryIdWRef })[0],
                        CountryId: $scope.CountryIdWRef
                    };
                    $scope.workReferences.push(wReference);
                    $scope.clearWorkReference();

                    alertService.add('success', 'Enhorabuena', 'Registro se ha insertado correctamente.');
                    $scope.alertsTags = $rootScope.alerts;
                }
            } else {
                alertService.add('danger', 'Error', 'Complete todos los campos correctamente.');
                $scope.alertsTags = $rootScope.alerts;
            }
        };
        $scope.removeWorkReference = function (index) {
            $scope.workReferences.splice(index, 1);
            alertService.add('success', 'Enhorabuena', 'Registro se ha eliminado correctamente.');
            $scope.alertsTags = $rootScope.alerts;
        };

        /*PersonalReference*/
        $scope.clearPersonalReference = function () {
            $scope.textButton = 'Agregar';
            $scope.FirstNamePRef = "";
            $scope.LastNamePRef = "";
            $scope.ChargePRef = "";
            $scope.CellphonePRef = "";
            $scope.EmailPRef = "";
            $scope.CompanyNamePRef = "";
            $scope.RelationshipPRef = "";
            $scope.CityIdPRef = "";
            $scope.CountryIdPRef = "";
            $scope.action = '';
            $scope.index = -1;
        };
        $scope.fillPersonalReference = function (index) {
            $scope.textButton = 'Editar';
            $scope.FirstNamePRef = $scope.personalReferences[index].FirstName,
                $scope.LastNamePRef = $scope.personalReferences[index].LastName,
                $scope.ChargePRef = $scope.personalReferences[index].Charge,
                $scope.CellphonePRef = $scope.personalReferences[index].Cellphone,
                $scope.EmailPRef = $scope.personalReferences[index].Email,
                $scope.CompanyNamePRef = $scope.personalReferences[index].CompanyName,
                $scope.RelationshipPRef = $scope.personalReferences[index].Relationship,
                $scope.CityIdPRef = $scope.personalReferences[index].CityId,
                $scope.CountryIdPRef = $scope.personalReferences[index].City.CountryId;
            $scope.action = 'edit';
            $scope.index = index;
        };
        $scope.addPersonalReference = function () {
            if ($scope.personalReferenceFormEdit) {
                if ($scope.action == 'edit') {
                    $scope.personalReferences[$scope.index].FirstName = $scope.FirstNamePRef,
                        $scope.personalReferences[$scope.index].LastName = $scope.LastNamePRef,
                        $scope.personalReferences[$scope.index].Charge = $scope.ChargePRef,
                        $scope.personalReferences[$scope.index].Cellphone = $scope.CellphonePRef,
                        $scope.personalReferences[$scope.index].Email = $scope.EmailPRef,
                        $scope.personalReferences[$scope.index].CompanyName = $scope.CompanyNamePRef,
                        $scope.personalReferences[$scope.index].Relationship = $scope.RelationshipPRef,
                        $scope.personalReferences[$scope.index].CityId = $scope.CityIdPRef,
                        $scope.personalReferences[$scope.index].City = $filter('filter')($scope.Cities, { CityId: $scope.CityPRef })[0],
                        $scope.personalReferences[$scope.index].CountryId = $scope.CountryIdPRef,
                        $scope.personalReferences[$scope.index].Country = $filter('filter')($scope.Countries, { CountryId: $scope.CountryIdPRef })[0];

                    alertService.add('success', 'Enhorabuena', 'Registro se ha actualizado correctamente.');
                    $scope.alertsTags = $rootScope.alerts;
                } else {
                    var pReference = {
                        FirstName: $scope.FirstNamePRef,
                        LastName: $scope.LastNamePRef,
                        Charge: $scope.ChargePRef,
                        Cellphone: $scope.CellphonePRef,
                        Email: $scope.EmailPRef,
                        CompanyName: $scope.CompanyNamePRef,
                        Relationship: $scope.RelationshipPRef,
                        CityId: $scope.CityIdPRef,
                        City: $filter('filter')($scope.Cities, { CityId: $scope.CityPRef })[0],
                        CountryId: $scope.CountryIdPRef,
                        Country: $filter('filter')($scope.Countries, { CountryId: $scope.CountryIdPRef })[0]
                    };
                    $scope.personalReferences.push(pReference);
                    $scope.clearPersonalReference();

                    alertService.add('success', 'Enhorabuena', 'Registro se ha insertado correctamente.');
                    $scope.alertsTags = $rootScope.alerts;
                }
            } else {
                alertService.add('danger', 'Error', 'Complete todos los campos correctamente.');
                $scope.alertsTags = $rootScope.alerts;
            }
        };
        $scope.removePersonalReference = function (index) {
            $scope.personalReferences.splice(index, 1);
            alertService.add('success', 'Enhorabuena', 'Registro se ha eliminado correctamente.');
            $scope.alertsTags = $rootScope.alerts;
        };
           
        /*Tranning*/
        $scope.clearTranning = function () {
            $scope.textButton = 'Agregar';
            $scope._TrainingName = "",
                $scope._InstitutionName = "",
                $scope._AcademicLevel = "",
                $scope._EducationTypeId = "",
                $scope._CityId = "",
                $scope._Year = "",
                $scope._CountryId = "";
            $scope.action = '';
            $scope.index = -1;
        };
        $scope.fillTranning = function (index) {
            $scope.textButton = "Editar";
            $scope._TrainingName = $scope.Trannings[index].TrainingName,
                $scope._InstitutionName = $scope.Trannings[index].InstitutionName,
                $scope._CareerId = $scope.Trannings[index].CareerId,
                $scope._EducationTypeId = $scope.Trannings[index].EducationTypeId,
                $scope._CityId = $scope.Trannings[index].CityId,
                $scope._Year = $scope.Trannings[index].Year,
                $scope._CountryId = $scope.Trannings[index].City.CountryId;
            $scope.action = 'edit';
            $scope.index = index;
        };
        $scope.addTranning = function () {
            if ($scope.trainingFormEdit.$valid) {
                if ($scope.action == 'edit') {
                    $scope.Trannings[$scope.index].TrainingName = $scope._TrainingName;
                    $scope.Trannings[$scope.index].InstitutionName = $scope._InstitutionName;
                    $scope.Trannings[$scope.index].Career = $filter('filter')($scope.AllCarees, { CareerId: $scope._CareerId })[0];
                    $scope.Trannings[$scope.index].CareerId = $scope._CareerId;
                    $scope.Trannings[$scope.index].EducationTypeId = $scope._EducationTypeId;
                    $scope.Trannings[$scope.index].City = $filter('filter')($scope.Cities, { CityId: $scope._CityId })[0];
                    $scope.Trannings[$scope.index].CityId = $scope._CityId;
                    $scope.Trannings[$scope.index].Year = $scope._Year;
                    $scope.Trannings[$scope.index].Country = $filter('filter')($scope.Countries, { CountryId: $scope._CountryId })[0];
                    $scope.Trannings[$scope.index].CountryId = $scope._CountryId;

                    alertService.add('success', 'Enhorabuena', 'Registro se ha actualizado correctamente.');
                    $scope.alertsTags = $rootScope.alerts;
                } else {
                    var tranning = {
                        TrainingName: $scope._TrainingName,
                        InstitutionName: $scope._InstitutionName,
                        Career: $filter('filter')($scope.AllCarees, { CareerId: $scope._CareerId })[0],
                        CareerId: $scope._CareerId,
                        EducationTypeId: $scope._EducationTypeId,
                        City: $filter('filter')($scope.Cities, { CityId: $scope._CityId })[0],
                        CityId: $scope._CityId,
                        Year: $scope._Year,
                        Country: $filter('filter')($scope.Countries, { CountryId: $scope._CountryId })[0],
                        CountryId: $scope._CountryId
                    };
                    if (!$scope.Trannings)
                        $scope.Trannings = [];

                    $scope.Trannings.push(tranning);
                    $scope.clearTranning();
                    alertService.add('success', 'Enhorabuena', 'Registro se ha insertado correctamente.');
                    $scope.alertsTags = $rootScope.alerts;
                }
            } else {
                alertService.add('danger', 'Error', 'Complete todos los campos correctamente.');
                $scope.alertsTags = $rootScope.alerts;
            }
        };
        $scope.removeTranning = function (index) {
            $scope.Trannings.splice(index, 1);
            alertService.add('success', 'Enhorabuena', 'Registro se ha eliminado correctamente.');
            $scope.alertsTags = $rootScope.alerts;
        };

        customerRepository.getCities().success(function (data) {
            $scope.Cities = data;
        });
        customerRepository.getCareers().success(function (data) {
            $scope.AllCarees = data;
        });
        customerRepository.getCountries().success(function (data) {
            $scope.Countries = data;
        });
        customerRepository.getAcademicLevels().success(function (data) {

            $scope.AcademicLevels = data;
        });
        customerRepository.getEducationTypes().success(function (data) {

            $scope.EducationTypes = data;
        });
        customerRepository.getLanguages().success(function (data) {

            $scope.Languages = data;
        });
        customerRepository.getLanguageLevels().success(function (data) {

            $scope.LanguageLevels = data;
        });


        $scope.getCareersByAcademicLevel = function(academicLevelId) {
            for (var i = 0; i < $scope.AcademicLevels.length; i++) {
                var id = $scope.AcademicLevels[i].AcademicLevelId;
                if (academicLevelId.AcademicLevelId == id)
                    return $scope.AcademicLevels[i].Careers;
            }
        };

        $scope.getCitiesByCountry = function (countryId) {
            if (countryId)
                return $filter('filter')($scope.Countries, { CountryId: countryId })[0].Cities;
        };

        $scope.assignCareers = function () {
            if ($scope.AcademicLevelId)
                $scope.Careers = $filter('filter')($scope.AcademicLevels, { AcademicLevelId: $scope.AcademicLevelId })[0].Careers;
        }

        $scope.update = function() {
            $scope.New.References = [];
            $scope.New.AcademicEducations = [];

            if ($scope.academicEducations.length > 0) {

                for (var i = 0; i < $scope.academicEducations.length; i++) {
                    var academic = {
                        AcademicEducationId: ($scope.academicEducations[i].AcademicEducationId) ? $scope.academicEducations[i].AcademicEducationId : 0,
                        Year: $scope.academicEducations[i].Year,
                        CountryId: $scope.academicEducations[i].City.Country.CountryId,
                        CityId: $scope.academicEducations[i].City.CityId,
                        AcademicLevelId: $scope.academicEducations[i].AcademicLevel.AcademicLevelId,
                        TrainingName: $scope.academicEducations[i].TrainingName,
                        InstitutionName: $scope.academicEducations[i].InstitutionName,
                        CareerId: $scope.academicEducations[i].CareerId,
                        EducationTypeId: 1
                    };
                    $scope.New.AcademicEducations.push(academic);
                }
            }
            if ($scope.Trannings.length > 0) {
                for (var i = 0; i < $scope.Trannings.length; i++) {
                    var tranning = {
                        AcademicEducationId: ($scope.Trannings[i].AcademicEducationId) ? $scope.Trannings[i].AcademicEducationId : 0,
                        Year: $scope.Trannings[i].Year,
                        CountryId: $scope.Trannings[i].City.Country.CountryId,
                        CityId: $scope.Trannings[i].City.CityId,
                        TrainingName: $scope.Trannings[i].TrainingName,
                        InstitutionName: $scope.Trannings[i].InstitutionName,
                        CareerId: $scope.Trannings[i].CareerId,
                        EducationTypeId: 2
                    };
                    $scope.New.AcademicEducations.push(tranning);
                }
            }
            if ($scope.workReferences.length > 0) {
                for (var l = 0; l < $scope.workReferences.length; l++) {
                    var wExperience = {
                        ReferenceId: ($scope.workReferences[l].ReferenceId) ? $scope.workReferences[l].ReferenceId : 0,
                        FirstName: $scope.workReferences[l].FirstName,
                        LastName: $scope.workReferences[l].LastName,
                        Charge: $scope.workReferences[l].Charge,
                        Cellphone: $scope.workReferences[l].Cellphone,
                        Email: $scope.workReferences[l].Email,
                        CompanyName: $scope.workReferences[l].CompanyName,
                        Relationship: $scope.workReferences[l].Relationship,
                        ReferenceTypeId: 1,
                        CityId: $scope.workReferences[l].City.CityId
                    }

                    $scope.New.References.push(wExperience);
                }
            }

            if ($scope.personalReferences.length > 0) {
                for (var l = 0; l < $scope.personalReferences.length; l++) {
                    var pExperience = {
                        ReferenceId: ($scope.personalReferences[l].ReferenceId) ? $scope.personalReferences[l].ReferenceId : 0,
                        FirstName: $scope.personalReferences[l].FirstName,
                        LastName: $scope.personalReferences[l].LastName,
                        Charge: $scope.personalReferences[l].Charge,
                        Cellphone: $scope.personalReferences[l].Cellphone,
                        Email: $scope.personalReferences[l].Email,
                        CompanyName: $scope.personalReferences[l].CompanyName,
                        Relationship: $scope.personalReferences[l].Relationship,
                        ReferenceTypeId: 2,
                        CityId: $scope.personalReferences[l].City.CityId
                    }

                    $scope.New.References.push(pExperience);
                }
            }
            if ($scope.editClientForm.$valid) {
                customerRepository.UpdateCustomer($scope.New).success(function () {
                    alertService.add('success', 'Enhorabuena', 'Registro se ha actualizado correctamente.');
                    $scope.alertsTags = $rootScope.alerts;
                    $location.path("/AllClients");
                }).error(function () {
                    alertService.add('danger', 'Error', 'No se ha podido actualizar el registro.');
                    $scope.alertsTags = $rootScope.alerts;
                });
            } else {
                alertService.add('danger', 'Error', 'Complete correctamente todos los campos.');
                $scope.alertsTags = $rootScope.alerts;
            }
                
        }
    }]).controller("CustomerTrackingController", ['$scope', '$rootScope', '$routeParams', '$location', '$filter', 'filterFilter', 'customerRepository', function ($scope, $rootScope, $routeParams, $location, $filter, filterFilter, customerRepository) {
        //Sorting
        $scope.sort = "FirstName";
        $scope.reverse = false;
        $scope.load = true;

        //Sorting
        $scope.sort = "FirstName";
        $scope.reverse = false;

        $scope.changeSort = function (value) {
            if ($scope.sort == value) {
                $scope.reverse = !$scope.reverse;
                return;
            }

            $scope.sort = value;
            $scope.reverse = false;
        }
        //End Sorting//
        $scope.itemsPerPageList = [5, 10, 20, 30, 40, 50];
        $scope.entryLimit = $scope.itemsPerPageList[0];

        $scope.itemsPerTrackingPageList = [1, 2, 3, 4, 5];
        $scope.entryTrackingLimit = $scope.itemsPerTrackingPageList[0];
        $scope.currentPage = 1; //current page

        $scope.setTracking = function (term) {
            if (!term)
                $scope.load = true;

            customerRepository.getCustomer($routeParams.id).success(function (data) {
                $scope.Trackings = [];
                $scope.personalReferences = [];
                if (data.Birthday)
                    data.Birthday = new Date(data.Birthday);

                $scope.Trackings = angular.copy(data.Trackings);

                $scope.Client = data;

                $scope.totalServerItems = data.totalItems;
                $scope.items = data.items;
                $scope.load = false;

                if ($rootScope.alerts)
                    $scope.alertsTags = $rootScope.alerts;
                $scope.maxSize = 5; //pagination max size
                //max rows for data table

                $scope.setTrackingFiltered(term);

                /* init pagination with $scope.list */
                customerRepository.getStates().success(function (data) {
                    $scope.States = data;
                }).error(function () {

                });

            });
        }
        
        $scope.setData = function (term) {
            if (!term)
                $scope.load = true;
            else {
                //if (term.State) {
                term.StateId = (!term.StateId) ? "" : term.StateId;
                if(term.Trackings)
                term.Trackings[0].TrackingType.Name = (!term.Trackings[0].TrackingType.Name) ? "" : term.Trackings[0].TrackingType.Name;
                //}
            }
            customerRepository.getCustomers().success(function (data) {
                $scope.customerData = data;
                $scope.totalServerItems = data.totalItems;
                $scope.items = data.items;
                $scope.load = false;

                if ($rootScope.alerts)
                    $scope.alertsTags = $rootScope.alerts;

                $scope.maxSize = 5; //pagination max size

                /* init pagination with $scope.list */
                $scope.setFiltered(term);


            })
                    .error(function (data) {
                        alertService.add('danger', 'Error', 'No se han cargado los datos correctamente.');
                        $scope.alertsTags = $rootScope.alerts;
                        $scope.load = false;
                    });

        };
        
        $scope.setFiltered = function (term) {
            $scope.filtered = filterFilter($scope.customerData, term);

            $scope.itemsInPage = ($scope.filtered.length) ? ((($scope.currentPage * $scope.entryLimit) > $scope.filtered.length) ?
                    $scope.filtered.length - (($scope.currentPage - 1) * $scope.entryLimit) : $scope.entryLimit) : 0;
            $scope.noOfPages = ($scope.filtered) ? Math.ceil($scope.filtered.length / $scope.entryLimit) : 1;
        };

        $scope.setTrackingFiltered = function (term) {
            $scope.filtered = filterFilter($scope.Client.Trackings[0].TrackingDetails, term);

            $scope.itemsInPage = ($scope.filtered.length) ? ((($scope.currentPage * $scope.entryLimit) > $scope.filtered.length) ?
                    $scope.filtered.length - (($scope.currentPage - 1) * $scope.entryLimit) : $scope.entryLimit) : 0;
            $scope.noOfPages = ($scope.filtered) ? Math.ceil($scope.filtered.length / $scope.entryLimit) : 1;
        }

        $scope.$watch('search', function (term) {
            // Create $scope.filtered and then calculat $scope.noOfPages, no racing!
            $scope.setData(term);
        });

        $scope.$watch('searchTracking', function (term) {
            // Create $scope.filtered and then calculat $scope.noOfPages, no racing!
            if ($scope.Client){
                $scope.setTracking(term);
            }
        });

        $scope.setScope = function (obj, action) {
            $scope.action = action;
            $scope.Client = obj;
            $location.url('ClientTracking/' + obj.ClientId);
        };

        customerRepository.getEmployees().success(function (data) {
            $scope.Employees = data;
        })
        customerRepository.getCompanies().success(function (data) {
            $scope.Companies = data;
        });
        $scope.getStates = function () {
            customerRepository.getStates().success(function (data) {
                $scope.States = data;
            });
        };
        $scope.insertTracking = function (tracking) {
            //tracking.ShipmentTypeId = 1;
            tracking.TrackingId = $scope.Trackings[0].TrackingId;
            customerRepository.InsertTracking(tracking).success(function () {
                $scope.setTracking();
            }).error(function () {

            });
        };

        $scope.clearTracking = function () {
            $scope.tracking = { Description: "", Comment: "" };
            $scope.action = '';
        };

        $scope.saveTracking = function () {
            customerRepository.UpdateTracking($scope.Client).success(function () {
                $location.url('ClientTracking');
            }).error(function () {
                
            });
        };

        $scope.getTracking = function (index) {
            
            $scope.tracking = angular.copy($scope.Trackings[0].TrackingDetails[index]);
            //if ($scope.tracking.Comment)
            //$scope.tracking.Comment = $scope.Trackings[0].TrackingDetails[index].Comment;
            $scope.index = index;
            $scope.action = 'edit';
        }

        $scope.getTrackingTypes = function () {
            customerRepository.getTrackingTypes().success(function (data) {
                $scope.trackingTypes = data;
            })
        }

        $scope.fillTracking = function () {
            if ($scope.trackingFormEdit.$valid) {
                if ($scope.action == 'edit') {
                    $scope.Client.Trackings[0].TrackingDetails[$scope.index].Description = $scope.tracking.Description;
                    if ($scope.tracking.Comment)
                        $scope.Client.Trackings[0].TrackingDetails[$scope.index].Comment = $scope.tracking.Comment;
                    $scope.tracking = { Description: "", Comment: "" };
                } else {
                    $scope.tracking = { Description: $scope.tracking.Description, Comment: ($scope.tracking.Comment) ? $scope.tracking.Comment : "", Date: new Date() };
                    $scope.Client.Trackings[0].TrackingDetails.push($scope.tracking);
                }
            } else {

            }
            $scope.action = 'edit';
        };

        $scope.back = function () {
            $location.url('ClientTracking');
        }

        $scope.selectedTracking = function (index) {
            $scope.selectedTrackingDetail = index;
        }

        $scope.deleteTracking = function (index) {
            $scope.Client.Trackings[0].TrackingDetails.splice(index, 1);
        };
        

    }]);