﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace AccionLaboral.Controllers.Home
{
    public class UsersController : Controller
    {
        //
        // GET: /Users/
        public ActionResult Index()
        {
            //return View();
            return new FilePathResult("~/Views/Users/Index.html", "text/html");
        }

        //
        // GET: /Login/
        public ActionResult Login()
        {
            //return View();
            return new FilePathResult("~/Views/Login/Login.html", "text/html");
        }

        //
        // GET: /ForgotPassword/
        public ActionResult ForgotPassword()
        {
            return new FilePathResult("~/Views/Login/ForgotPassword.html", "text/html");
        }

        // GET: /ChangePassword/
        public ActionResult ChangePassword()
        {
            return new FilePathResult("~/Views/Users/ChangePassword.html", "text/html");
        }

        //
        // GET: /RessetPassword/
        public ActionResult ResetPassword()
        {
            return new FilePathResult("~/Views/Login/ResetPassword.html", "text/html");
        }

        //
        // GET: /Users/Details/5
        public ActionResult Details(int id)
        {
            return View();
        }

        //
        // GET: /Users/Create
        public ActionResult Create()
        {
            return View();
        }

        //
        // POST: /Users/Create
        [HttpPost]
        public ActionResult Create(FormCollection collection)
        {
            try
            {
                // TODO: Add insert logic here

                return RedirectToAction("Index");
            }
            catch
            {
                return View();
            }
        }

        //
        // GET: /Users/Edit/5
        public ActionResult Edit(int id)
        {
            return View();
        }

        //
        // POST: /Users/Edit/5
        [HttpPost]
        public ActionResult Edit(int id, FormCollection collection)
        {
            try
            {
                // TODO: Add update logic here

                return RedirectToAction("Index");
            }
            catch
            {
                return View();
            }
        }

        //
        // GET: /Users/Delete/5
        public ActionResult Delete(int id)
        {
            return View();
        }

        //
        // POST: /Users/Delete/5
        [HttpPost]
        public ActionResult Delete(int id, FormCollection collection)
        {
            try
            {
                // TODO: Add delete logic here

                return RedirectToAction("Index");
            }
            catch
            {
                return View();
            }
        }
    }
}
