﻿function ConutryKO()
{
    var self = this;
    self.id = ko.observable(0);
    self.country = ko.observable("");
    self.countryrank = ko.observable("");
    self.shippingrate = ko.observable("");
    self.allowfreeshipping = ko.observable(false);
    self.minimumamountforfreeshipping = ko.observable("");
    self.isactive = ko.observable(false);


    self.Success = ko.observable(false);
    self.Error = ko.observable(false);
    self.MessageSuccess = ko.observable("");
    self.MessageError = ko.observable("");
    self.savebtn = ko.observable(true);
    self.updatebtn = ko.observable(false);
    self.txtmaf = ko.observable(false);
    self.countrys = ko.observableArray();

    self.insert = ko.observable(false);
    self.index = ko.observable(true);
    self.datadownside = ko.observable();
    self.dataupside = ko.observable();


    //variable og paging
    self.currentPage = ko.observable();
    self.pageSize = ko.observable(10);
    self.currentPageIndex = ko.observable(1);
    self.totalrecord = ko.observable(0);
    self.search = ko.observable(true);



    self.entrsv = function (d, e) {
        if (e.keyCode == 13) {
            if (self.updatebtn() == true) {
                self.Update(d);
            }
            else {
                self.Save(d);
            }
        }
    }

    self.txtbxshow=function()
    {
 
        if (self.allowfreeshipping() == true) {
            self.txtmaf(true);
        }
        else
        {
            self.txtmaf(false);

        }

    }
   
    self.clear = function () {
        self.id("");
        self.country("");
        self.countryrank(1);
        self.shippingrate("");
        self.allowfreeshipping("");
        self.minimumamountforfreeshipping("");
        self.isactive("");
    }

    self.Addnew = function () {
        document.getElementById("add").innerText = "Add Country";
        self.clear();
        self.Success(false);
        self.Error(false);
        self.index(false);
        self.insert(true);
        self.savebtn(true);
        self.updatebtn(false);
        getmaxrank();
        $('#countryname').focus();
    }
    function getmaxrank() {
        $.ajax({
            type: "GET",
            url: '/Country/getrank',
            Contenttype: "application/JSON",
            success: function (data) {
                self.countryrank(data[0].countryrank + 1);
            }
        });
    }

    self.Cancel = function () {
        self.Success(false);
        self.Error(false);
        self.index(true);
        self.insert(false);
        self.clear();
    }

    self.Save = function (data) {

        if (self.checkvalidation()) {
            self.Error(false);
            $.ajax(
                {
                    type: "POST",
                    url: "/Country/Insert",
                    data: ko.toJSON(data),
                    contentType: "application/json",
                    async: true,
                    success: function (data) {
                        self.Error(false);
                        self.MessageSuccess("Record has been Saved Successfully.");
                        self.Success(true);
                        self.insert(false);
                        self.index(true);
                        getdata();
                        gettotalrecord();
                        self.clear();
                    },
                    error: function (error) {
                        self.MessageError(error);
                        self.Error(true);
                    }
                });
        }
        else {
            self.Error(true);
        }
    }

    self.checkvalidation = function () {
        var IsError = true;
        self.MessageError('');
        if (self.country() == "") {
            self.MessageError(self.MessageError() + "<br/> - Country is required.");
            IsError = false;
        }
        if (self.countryrank() == "") {
            self.MessageError(self.MessageError() + "<br/> - Country Rank is required.");
            IsError = false;
        }

        if (self.shippingrate() == "") {
            self.MessageError(self.MessageError() + "<br/> - Shipping Rate is required.");
            IsError = false;
        }
        self.Error(true);
        return IsError;
    }




    //pagging

    self.getselectedpages = function (countrys) {
        self.Success(false);
        self.Error(false);
        self.id(countrys.id);
        self.country(countrys.country);
        self.countryrank(countrys.countryrank);
        self.shippingrate(countrys.shippingrate);
        self.isactive(countrys.isactive);
        self.allowfreeshipping(countrys.allowfreeshipping);
        self.minimumamountforfreeshipping(countrys.minimumamountforfreeshipping);
        self.index(false);
        document.getElementById("add").innerText = "Edit Country";
        self.insert(true);
        self.updatebtn(true);
        self.savebtn(false);
        $('#countryname').focus();
    }

    self.searchKeyUp = function (d, e) {
        if (e.keyCode == 13) {
            self.Search();
        }
    }

    self.currentPage = ko.computed(function () {
        var pagesize = parseInt(self.pageSize(), 10),
        startIndex = pagesize * self.currentPageIndex(),
        endIndex = startIndex + pagesize;
        return self.countrys.slice(startIndex, endIndex);
    });

    function getdata() {
        $('#loader').show();
        rec = self.totalrecord();
        Filname = document.getElementById("FilterbyName").value;
        var pagesize = document.getElementById("pageSizeSelector").value;
        if (self.currentPageIndex() > 1) {
            var ttl = rec / pagesize;
            var diff = self.currentPageIndex() - ttl;
            if (rec > 31) {
                if (diff > .9) {
                    self.currentPageIndex(self.currentPageIndex() - 1);
                }
            }
            else {
                if (diff > .8) {
                    self.currentPageIndex(self.currentPageIndex() - 1);
                }
            }
        }
        $.ajax({
            type: "GET",
            url: '/Country/search?PageSize=' + pagesize + "&PageNo=" + self.currentPageIndex() + "&country=" + Filname,
            Contenttype: "application/JSON",
            success: function (data) {
                self.countrys(data);
                $('#loader').hide();
                
                if ((self.totalrecord() / pagesize) <= self.currentPageIndex()) {

                    document.getElementById("btnnext").disabled = true;
                }
                else {

                    document.getElementById("btnnext").disabled = false;
                }
                if (self.currentPageIndex() > 1) {

                    document.getElementById("btnprev").disabled = false;
                }
                else {
                    document.getElementById("btnprev").disabled = true;
                }
            }
        });
    }

    self.SortData = function () {
        self.Error(false);
        self.Success(false);
        $('#loader').show();
        if (document.getElementById("Hforder").value == "asc") {
            document.getElementById("Hforder").value = "desc";

            var sort = "order by countryrank desc"
            $("#imgasc").attr('src', '/Content/Images/down_arrow.png');

        }
        else {
            document.getElementById("Hforder").value = "asc";
            var sort = "order by countryrank asc"
            $("#imgasc").attr('src', '/Content/Images/up_arrow.png');
        }

        var Filname = document.getElementById("FilterbyName").value;
        var pageno = self.currentPageIndex();
        var pagesize = document.getElementById("pageSizeSelector").value;
        $.ajax({
            type: "GET",
            url: "/Country/search?PageSize=" + pagesize + "&PageNo=" + pageno + "&country=" + Filname + "&sort=" + sort,
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (data) {
                self.countrys(data); gettotalrecord();//GetEmployees();
                $('#loader').hide();
            },
            error: function (error) {
                alert(error.status + "<!----!>" + error.statusText);
                $('#loader').hide();
            }
        });

    }

    self.Search = function (countrys) {
        $('#loader').show();
        self.Error(false);
        self.Success(false);
        if (document.getElementById("Hforder").value == "desc") {


            var sort = "order by countryrank desc"
            $("#imgasc").attr('src', '/Content/Images/down_arrow.png')

        }
        else {

            var sort = "order by countryrank asc"
            $("#imgasc").attr('src', '/Content/Images/up_arrow.png');
        }
        var pagesize = document.getElementById("pageSizeSelector").value;
        var Filname = document.getElementById("FilterbyName").value;
        
        var oldpageno = self.currentPageIndex();
        self.currentPageIndex(1);
        var pageno = 1;
        gettotalrecord();
        $.ajax({
            type: "GET",
            url: "/Country/Search?PageSize=" + pagesize + "&PageNo=" + pageno + "&country=" + Filname + "&sort=" + sort,
            contentType: "application/json; charset=utf-8",
            async: false,
            dataType: "json",
            success: function (data) {

                if (data.length == 0) {
                    self.Success(false);
                    self.MessageError("No Record Found.");
                    self.Error(true);
                    $('#error').text("");
                    self.countrys(data);
                    $('#loader').hide();
                    return;

                }
                self.countrys(data);
                $('#loader').hide();
                self.Error(false);
                self.Success(false);
                if ((self.totalrecord() / pagesize) <= self.currentPageIndex()) {

                    document.getElementById("btnnext").disabled = true;
                }
                else {

                    document.getElementById("btnnext").disabled = false;
                }
                if (self.currentPageIndex() > 1) {

                    document.getElementById("btnprev").disabled = false;
                }
                else {
                    document.getElementById("btnprev").disabled = true;
                }
            },
            error: function (error) {
                self.MessageError(error);
                self.Error(true);
                $("#loader").hide();
            }
        });

        $("#loader").hide();

    };

    function gettotalrecord() {

        Filname = document.getElementById("FilterbyName").value;
        var pagesize = document.getElementById("pageSizeSelector").value;
        $.ajax({
            type: "GET",
            url: '/Country/search?PageSize=' + pagesize + "&PageNo=-1" + "&country=" + Filname,
            Contenttype: "application/JSON",
            success: function (data) {
                self.totalrecord(data[0].id);
            }
        });
    }

    self.nextPage = function () {
        self.Error(false);
        self.Success(false);
        $('#loader').show();
        if (document.getElementById("Hforder").value == "desc") {


            var sort = "order by countryrank desc"
            $("#imgasc").attr('src', '/Content/Images/down_arrow.png')

        }
        else {

            var sort = "order by countryrank asc"
            $("#imgasc").attr('src', '/Content/Images/up_arrow.png');
        }


        self.currentPageIndex(self.currentPageIndex() + 1);
        if (self.currentPageIndex() > 1) {

            var pageno = self.currentPageIndex();
        }
        else {
            var pageno = 1;
        }
        Filname = document.getElementById("FilterbyName").value;
        var pagesize = document.getElementById("pageSizeSelector").value;
        $.ajax({
            type: "GET",
            url: "/Country/search?PageSize=" + pagesize + "&PageNo=" + pageno + "&country=" + Filname  + "&sort=" + sort,
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (data) {
                self.countrys(data);//GetEmployees();
                $('#loader').hide();
                if ((self.totalrecord() / pagesize) <=  self.currentPageIndex()) {

                    document.getElementById("btnnext").disabled = true;
                }
                else {

                    document.getElementById("btnnext").disabled = false;
                }
                if (self.currentPageIndex() > 1) {

                    document.getElementById("btnprev").disabled = false;
                }
                else {
                    document.getElementById("btnprev").disabled = true;
                }
            }
        });



    };

    self.previousPage = function () {
        self.Error(false);
        self.Success(false);
        $('#loader').show();
        if (document.getElementById("Hforder").value == "desc") {


            var sort = "order by countryrank desc"
            $("#imgasc").attr('src', '/Content/Images/down_arrow.png')

        }
        else {

            var sort = "order by countryrank asc"
            $("#imgasc").attr('src', '/Content/Images/up_arrow.png');
        }


        if (self.currentPageIndex() > 1) {

            self.currentPageIndex(self.currentPageIndex() - 1);
            var pageno = self.currentPageIndex();

        }
        else {
            var pageno = 1;
        }
        Filname = document.getElementById("FilterbyName").value;
        var pagesize = document.getElementById("pageSizeSelector").value;
        $.ajax({
            type: "GET",
            url: "/Country/search?PageSize=" + pagesize + "&PageNo=" + pageno + "&country=" + Filname + "&sort=" + sort,
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (data) {
                self.countrys(data);//GetEmployees();
                $('#loader').hide();
                if ((self.totalrecord() / pagesize) <= self.currentPageIndex()) {

                    document.getElementById("btnnext").disabled = true;
                }
                else {

                    document.getElementById("btnnext").disabled = false;
                }
                if (self.currentPageIndex() > 1) {

                    document.getElementById("btnprev").disabled = false;
                }
                else {
                    document.getElementById("btnprev").disabled = true;
                }
            }
        });
    };

    self.selectionChanged = function (event) {
        self.Error(false);
        self.Success(false);
        $('#loader').show();
        if (document.getElementById("Hforder").value == "desc") {


            var sort = "order by countryrank desc"
            $("#imgasc").attr('src', '/Content/Images/down_arrow.png')

        }
        else {

            var sort = "order by countryrank asc"
            $("#imgasc").attr('src', '/Content/Images/up_arrow.png');
        }

        var pageno = self.currentPageIndex();
        var totalrec = document.getElementById("Hftotalrecord").value;
        var pagesize = document.getElementById("pageSizeSelector").value;

        if ((totalrec / pagesize) < pageno) {

            if (pageno == 1) {
                pageno = 1;
            }
            else {
                pageno = pageno - 1;
                self.currentPageIndex(self.currentPageIndex() - 1)
            }

        }

        Filname = document.getElementById("FilterbyName").value;
        $.ajax({
            type: "GET",
            url: "/Country/search?PageSize=" + pagesize + "&PageNo=" + pageno + "&country=" + Filname + "&sort=" + sort,
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (data) {
                self.countrys(data);
                $('#loader').hide();
                if ((self.totalrecord() / pagesize) <= self.currentPageIndex()) {

                    document.getElementById("btnnext").disabled = true;
                }
                else {

                    document.getElementById("btnnext").disabled = false;
                }
                if (self.currentPageIndex() > 1) {

                    document.getElementById("btnprev").disabled = false;
                }
                else {
                    document.getElementById("btnprev").disabled = true;
                }
            }
        });



    }

  
    self.changestatus = function (countrys) {
        
        var isactive = countrys.isactive;
        var id = countrys.id;

        $.ajax({
            type: "POST",
            url: "/Country/UpdateActive?id=" + id + "&Active=" + isactive,
            contentType: "application/json",
            success: function (data) {

                self.MessageSuccess("Record has been Updated Successfully.");
                self.Success(true);
                getdata();
            },
            error: function (error) {
            }
        });
    };

    self.Update = function (data) {
        
        if (self.checkvalidation()) {
            self.Error(false);
            $.ajax(
                {
                    type: "POST",
                    url: "/Country/Update",
                    data: ko.toJSON(data),
                    contentType: "application/json",
                    async: true,
                    success: function (data) {
                        self.index(true);
                        self.Error(false);
                        self.MessageSuccess("Record has been Updated Successfully.");
                        self.Success(true);
                        self.insert(false);
                        getdata();

                    },
                    error: function (error) {
                        self.MessageError(error);
                        self.Error(true);

                    }

                });
        }
        else {
            self.Error(true);

        }

    }

    self.deletepopup = function (countrys) {
        $("#myModal").modal('show');

        $('#DeleteID').val(countrys.id);
        


    }

    self.deleterec = function () {

        id = $('#DeleteID').val();
        $.ajax(
            {
                type: "POST",
                url: "/Country/Delete/" + id,
                success: function (data) {
                    $("#myModal").modal('hide');
                    self.Error(false);
                    self.MessageSuccess("Record has been Deleted Successfully.");
                    self.Success(true);
                    self.Error(false);
                    gettotalrecord();
                    getdata();
                    self.index(true);
                    self.insert(false);

                },
                error: function (error) {
                    self.MessageError(error);
                    self.Error(true);
                }
            })
    }

    self.Dataupside = function (countrys)
    {
        $.ajax({
            type: "POST",
            url: "/Country/updata?id=" + countrys.id + "&up=" + "up",
            contentType: "application/json",
            success: function (data) {
                self.MessageSuccess("Record has been Updated Successfully.");
                self.Success(true);
                getdata();
            },
            error: function (error) {
            }
        });
    }

    self.Datadownside=function(countrys)
    {
        $.ajax({
            type: "POST",
            url: "/country/downdata?id=" + countrys.id + "&down=" + "down",
            contentType: "application/json",
            success: function (data) {
                self.MessageSuccess("Record has been Updated Successfully.");
                self.Success(true);
                getdata();
            },
            error: function (error) {
            }
        });
        }

    gettotalrecord();
    getdata();



}