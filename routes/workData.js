const router = require("express").Router();
const findError = require("../utils/errorCodes");
const _ = require("lodash");
const workData = require("../models/workData");
const employeeData = require("../models/employees");
const assetAvblty = require("../models/assetAvailability");
const logData = require("../models/logs");
const eqData = require("../models/equipments");
const moment = require("moment");
const e = require("express");
const { isNull, intersection } = require("lodash");
const { default: mongoose } = require("mongoose");
const MS_IN_A_DAY = 86400000;
const HOURS_IN_A_DAY = 8;
const ObjectId = require("mongoose").Types.ObjectId;

function isValidObjectId(id) {
  if (ObjectId.isValid(id)) {
    if (String(new ObjectId(id)) === id) return true;
    return false;
  }
  return false;
}

router.get("/", async (req, res) => {
  try {
    let workList = await workData.model
      .find()
      // .populate("project")
      // .populate({
      //   path: "project",
      //   populate: {
      //     path: "customer",
      //     model: "customers",
      //   },
      // })
      .populate("equipment")
      .populate("driver")
      .populate("dispatch")
      .populate("appovedBy")
      .populate("createdBy")
      .populate("workDone")
      .sort([["_id", "descending"]]);
    // res.status(200).send(workList.filter((w) => !isNull(w.driver)));
    res.status(200).send(
      workList.filter((w) => {
        w.workDone !== null;
      })
    );
  } catch (err) {
    res.send(err);
  }
});

router.get("/v2", async (req, res) => {
  try {
    let workList = await workData.model
      .find()
      // .populate("project")
      // .populate({
      //   path: "project",
      //   populate: {
      //     path: "customer",
      //     model: "customers",
      //   },
      // })
      .populate("equipment")
      .populate("driver")
      .populate("dispatch")
      .populate("appovedBy")
      .populate("createdBy")
      .populate("workDone")
      .sort([["_id", "descending"]]);
    // res.status(200).send(workList.filter((w) => !isNull(w.driver)));
    res.status(200).send(workList);
  } catch (err) {
    res.send(err);
  }
});

router.get("/v3", async (req, res) => {
  try {
    let workList = await workData.model
      .find({ workStartDate: { $gte: "2022-07-01" } })
      .select(
        `dispatch.targetTrips dispatch.drivers dispatch.astDrivers  dispatch.shift dispatch.date dispatch.otherJobType
        project.prjDescription project.customer
        equipment.plateNumber equipment.eqDescription equipment.assetClass equipment.eqtype equipment.eqOwner
        equipment.eqStatus equipment.millage equipment.rate equipment.supplieRate equipment.uom
        startTime endTime duration tripsDone totalRevenue totalExpenditure projectedRevenue status siteWork workStartDate workEndDate
        workDurationDays dailyWork startIndex endIndex comment moreComment rate uom _id 
        `
      )

      // .populate("project")
      // .populate({
      //   path: "project",
      //   populate: {
      //     path: "customer",
      //     model: "customers",
      //   },
      // })
      .populate("driver")
      .populate("createdBy", "firstName lastName")
      .populate("workDone", "jobDescription")
      .sort([["_id", "descending"]]);

    // res.status(200).send(workList.filter((w) => !isNull(w.driver)));
    res.status(200).send(workList);
  } catch (err) {
    res.send(err);
  }
});

router.get("/filtered", async (req, res) => {
  let { startDate, endDate, searchText } = req.query;
  console.log(req.query);

  try {
    let workList = await workData.model
      .find({
        $and: [
          {
            // $or: [
            //   {
            //     "equipment.plateNumber": {
            //       $regex: searchText.toUpperCase(),
            //     },
            //   },
            //   {
            //     "project.prjDescription": {
            //       $regex: searchText.toUpperCase(),
            //     },
            //   },
            // ],
            workStartDate: { $gte: moment(startDate).toISOString() },
            workStartDate: { $lte: moment(endDate).toISOString() },
          },
        ],
      })
      .select(
        `dispatch.targetTrips dispatch.drivers dispatch.astDrivers  dispatch.shift dispatch.date dispatch.otherJobType
        project.prjDescription project.customer
        equipment.plateNumber equipment.eqDescription equipment.assetClass equipment.eqtype equipment.eqOwner
        equipment.eqStatus equipment.millage equipment.rate equipment.supplieRate equipment.uom
        startTime endTime duration tripsDone totalRevenue totalExpenditure projectedRevenue status siteWork workStartDate workEndDate
        workDurationDays dailyWork startIndex endIndex comment moreComment rate uom _id 
        `
      )

      // .populate("project")
      // .populate({
      //   path: "project",
      //   populate: {
      //     path: "customer",
      //     model: "customers",
      //   },
      // })
      .populate("driver")
      .populate("createdBy", "firstName lastName")
      .populate("workDone", "jobDescription")
      .sort([["_id", "descending"]]);

    // res.status(200).send(workList.filter((w) => !isNull(w.driver)));
    res.status(200).send(workList);
  } catch (err) {
    res.send(err);
  }
});

router.get("/v3/:vendorName", async (req, res) => {
  let { vendorName } = req.params;
  try {
    let workList = await workData.model
      .find(
        {},
        {
          "project.createdOn": false,
          "equipment.__v": false,
          "equipment.createdOn": false,
          "dispatch.project": false,
          "dispatch.equipments": false,
          "driver.password": false,
          "driver.email": false,
          "driver.createdOn": false,
          "driver.__v": false,
          "driver._id": false,
        }
      )

      // .populate("project")
      // .populate({
      //   path: "project",
      //   populate: {
      //     path: "customer",
      //     model: "customers",
      //   },
      // })
      .populate("equipment")
      .populate("driver")
      .populate("dispatch")
      .populate("appovedBy")
      .populate("createdBy")
      .populate("workDone")
      .sort([["_id", "descending"]]);

    // res.status(200).send(workList.filter((w) => !isNull(w.driver)));

    let filteredByVendor = workList.filter((w) => {
      return (
        // w.equipment.eqOwner === vendorName ||
        _.trim(w.driver.firstName) === _.trim(vendorName)
      );
    });
    res.status(200).send(filteredByVendor);
  } catch (err) {
    res.send(err);
  }
});

router.get("/v3/driver/:driverId", async (req, res) => {
  let { driverId } = req.params;
  // console.log(isValidObjectId(driverId));
  try {
    let workList = await workData.model
      .find(
        {
          $or: [
            {
              "equipment.eqOwner": driverId,
            },
            {
              driver: isValidObjectId(driverId) ? driverId : "123456789011",
            },
          ],
        },
        {
          "project.createdOn": false,
          "equipment.__v": false,
          "equipment.createdOn": false,
          "dispatch.project": false,
          "dispatch.equipments": false,
          "driver.password": false,
          "driver.email": false,
          "driver.createdOn": false,
          "driver.__v": false,
          "driver._id": false,
        }
      )
      .populate("equipment")
      .populate("driver")
      .populate("dispatch")
      .populate("appovedBy")
      .populate("createdBy")
      .populate("workDone")
      .sort([["_id", "descending"]]);

    let listToSend = workList
      .filter(
        (w) =>
          w.siteWork === false ||
          (w.siteWork === true &&
            (w.status === "in progress" || w.status === "on going")) ||
          (w.siteWork === true &&
            _.filter(w.dailyWork, (dW) => {
              return dW.date === moment().format("DD-MMM-YYYY");
            }).length === 0)
      )
      .filter(
        (w) =>
          // !isNull(w.driver) &&
          !isNull(w.workDone) && w.status !== "recalled"
      );

    let siteWorkList = [];

    let l = listToSend.map((w) => {
      let work = null;

      if (w.siteWork && w.status !== "stopped" && w.status !== "recalled") {
        let dailyWorks = w.dailyWork;

        let datesPosted = dailyWorks
          .filter((d) => d.pending === false)
          .map((d) => {
            return d.date;
          });

        let datesPendingPosted = dailyWorks
          .filter((d) => d.pending === true)

          .map((d) => {
            return d.date;
          });
        let workStartDate = moment(w.workStartDate);
        let workDurationDays = w.workDurationDays;

        let datesToPost = [workStartDate.format("DD-MMM-YYYY")];
        for (let i = 0; i < workDurationDays - 1; i++) {
          datesToPost.push(workStartDate.add(1, "days").format("DD-MMM-YYYY"));
        }

        let dateNotPosted = datesToPost.filter(
          (d) =>
            !_.includes(datesPosted, d) &&
            !_.includes(datesPendingPosted, d) &&
            moment().diff(moment(d, "DD-MMM-YYYY")) >= 0
        );

        datesPosted.map((dP) => {
          siteWorkList.push({
            workDone: w.workDone
              ? w.workDone
              : {
                  _id: "62690b67cf45ad62aa6144d8",
                  jobDescription: "Others",
                  eqType: "Truck",
                  createdOn: "2022-04-27T09:20:50.911Z",
                  __v: 0,
                },
            _id: w._id,
            status: "stopped",
            project: w.project,
            createdOn: w.createdOn,
            equipment: w.equipment,
            siteWork: w.siteWork,
            targetTrips: w.dispatch.targetTrips
              ? w.dispatch.targetTrips
              : "N/A",
            workStartDate: w.workStartDate,
            dispatchDate: new Date(dP).toISOString(),
            shift: w.dispatch.shift === "nightShift" ? "N" : "D",
            startIndex: w.startIndex
              ? parseFloat(w.startIndex).toFixed(2)
              : //  ? w.startIndex
                "0.0",
            millage: parseFloat(
              w.equipment.millage ? w.equipment.millage : 0
            ).toFixed(2),
            // millage: w.equipment.millage ? w.equipment.millage : 0,
          });
        });

        dateNotPosted.map((dNP) => {
          siteWorkList.push({
            workDone: w.workDone
              ? w.workDone
              : {
                  _id: "62690b67cf45ad62aa6144d8",
                  jobDescription: "Others",
                  eqType: "Truck",
                  createdOn: "2022-04-27T09:20:50.911Z",
                  __v: 0,
                },
            _id: w._id,
            status: "created",
            project: w.project,
            createdOn: w.createdOn,
            equipment: w.equipment,
            siteWork: w.siteWork,
            targetTrips: w.dispatch.targetTrips
              ? w.dispatch.targetTrips
              : "N/A",
            workStartDate: w.workStartDate,
            dispatchDate: new Date(dNP).toISOString(),
            shift: w.dispatch.shift === "nightShift" ? "N" : "D",
            startIndex: w.startIndex
              ? parseFloat(w.startIndex).toFixed(2)
              : // ?
                //   w.startIndex
                "0.0",
            millage: parseFloat(
              w.equipment.millage ? w.equipment.millage : 0
            ).toFixed(2),
          });
        });

        datesPendingPosted.map((dPP) => {
          siteWorkList.push({
            workDone: w.workDone
              ? w.workDone
              : {
                  _id: "62690b67cf45ad62aa6144d8",
                  jobDescription: "Others",
                  eqType: "Truck",
                  createdOn: "2022-04-27T09:20:50.911Z",
                  __v: 0,
                },
            _id: w._id,
            status: "in progress",
            project: w.project,
            createdOn: w.createdOn,
            equipment: w.equipment,
            siteWork: w.siteWork,
            targetTrips: w.dispatch.targetTrips
              ? w.dispatch.targetTrips
              : "N/A",
            workStartDate: w.workStartDate,
            dispatchDate: new Date(dPP).toISOString(),
            shift: w.dispatch.shift === "nightShift" ? "N" : "D",
            startIndex: w.startIndex
              ? parseFloat(w.startIndex).toFixed(2)
              : //  ? w.startIndex
                "0.0",
            millage: parseFloat(
              w.equipment.millage ? w.equipment.millage : 0
            ).toFixed(2),
            // millage: w.equipment.millage ? w.equipment.millage : 0,
          });
        });
      } else {
        work = {
          workDone: w.workDone
            ? w.workDone
            : {
                _id: "62690b67cf45ad62aa6144d8",
                jobDescription: "Others",
                eqType: "Truck",
                createdOn: "2022-04-27T09:20:50.911Z",
                __v: 0,
              },
          _id: w._id,
          status: w.status,
          project: w.project,
          createdOn: w.createdOn,
          equipment: w.equipment,
          siteWork: w.siteWork,
          targetTrips: w.dispatch.targetTrips ? w.dispatch.targetTrips : "N/A",
          workStartDate: w.workStartDate,
          dispatchDate: w.siteWork ? moment().toISOString() : w.dispatch.date,
          shift: w.dispatch.shift === "nightShift" ? "N" : "D",
          startIndex: w.startIndex
            ? parseFloat(w.startIndex).toFixed(2)
            : //  ? w.startIndex
              "0.0",
          millage: parseFloat(
            w.equipment.millage ? w.equipment.millage : 0
          ).toFixed(2),
          // millage: w.equipment.millage ? w.equipment.millage : 0,
        };
      }

      return work;
    });

    let finalList = l.concat(siteWorkList);

    let orderedList = _.orderBy(finalList, "dispatchDate", "desc");

    res.status(200).send(orderedList.filter((d) => !isNull(d)));
  } catch (err) {
    res.send(err);
  }
});

router.get("/v3/toreverse/:plateNumber", async (req, res) => {
  let { plateNumber } = req.params;
  let { startDate, endDate } = req.query;
  // console.log(isValidObjectId(driverId));
  if (plateNumber && startDate && endDate) {
    try {
      let workList = await workData.model
        .find(
          {
            "equipment.plateNumber": { $regex: plateNumber.toUpperCase() },
            workStartDate: { $gte: moment(startDate) },
            workStartDate: { $lte: moment(endDate).add(23, "hours") },
            $or: [
              { status: "stopped" },
              { status: "on going", "dailyWork.pending": false },
            ],
          },
          {
            "project.createdOn": false,
            "equipment.__v": false,
            "equipment.createdOn": false,
            "dispatch.project": false,
            "dispatch.equipments": false,
            "driver.password": false,
            "driver.email": false,
            "driver.createdOn": false,
            "driver.__v": false,
            "driver._id": false,
          }
        )
        .populate("equipment")
        .populate("driver")
        .populate("dispatch")
        .populate("appovedBy")
        .populate("createdBy")
        .populate("workDone")
        .sort([["_id", "descending"]]);

      let listToSend = workList;

      let siteWorkList = [];

      let l = listToSend.map((w) => {
        let work = null;

        if (w.siteWork === true) {
          let dailyWorks = w.dailyWork;

          let datesPosted = dailyWorks
            .filter((d) => d.pending === false)
            .map((d) => {
              return {
                _id: w._id,
                date: d.date,
                totalRevenue: d.totalRevenue,
                totalExpenditure: d.totalExpenditure,
                duration: d.duration,
                uom: d.uom,
              };
            });
          // console.log(datesPosted);

          let datesPendingPosted = dailyWorks
            .filter((d) => d.pending === true)

            .map((d) => {
              return d.date;
            });
          // let workStartDate = moment(w.workStartDate);
          // let workDurationDays = w.workDurationDays;

          // let datesToPost = [workStartDate.format("DD-MMM-YYYY")];
          // for (let i = 0; i < workDurationDays - 1; i++) {
          //   datesToPost.push(workStartDate.add(1, "days").format("DD-MMM-YYYY"));
          // }

          datesPosted.map((dP) => {
            siteWorkList.push({
              _id: dP._id,
              driverName: w.driver
                ? w.driver?.firstName + " " + w.driver?.lastName
                : w.equipment?.eqOwner,
              owner: w.equipment?.eqOwner,
              totalRevenue: parseFloat(dP.totalRevenue).toFixed(2),
              totalExpenditure: parseFloat(dP.totalExpenditure).toFixed(2),
              duration:
                dP.uom === "hour"
                  ? dP.duration / (1000 * 60 * 60)
                  : dP.duration,
              status: "stopped",
              project: w.project,
              createdOn: w.createdOn,
              equipment: w.equipment,
              siteWork: w.siteWork,
              targetTrips: w.dispatch.targetTrips
                ? w.dispatch.targetTrips
                : "N/A",
              workStartDate: w.workStartDate,
              dispatchDate: new Date(dP.date).toISOString(),
              shift: w.dispatch.shift === "nightShift" ? "N" : "D",
              startIndex: w.startIndex
                ? parseFloat(w.startIndex).toFixed(2)
                : //  ? w.startIndex
                  "0.0",
              millage: parseFloat(
                w.equipment.millage ? w.equipment.millage : 0
              ).toFixed(2),
              // millage: w.equipment.millage ? w.equipment.millage : 0,
            });
          });

          // dateNotPosted.map((dNP) => {
          //   siteWorkList.push({
          //     workDone: w.workDone
          //       ? w.workDone
          //       : {
          //           _id: "62690b67cf45ad62aa6144d8",
          //           jobDescription: "Others",
          //           eqType: "Truck",
          //           createdOn: "2022-04-27T09:20:50.911Z",
          //           __v: 0,
          //         },
          //     _id: w._id,
          //     status: "created",
          //     project: w.project,
          //     createdOn: w.createdOn,
          //     equipment: w.equipment,
          //     siteWork: w.siteWork,
          //     targetTrips: w.dispatch.targetTrips
          //       ? w.dispatch.targetTrips
          //       : "N/A",
          //     workStartDate: w.workStartDate,
          //     dispatchDate: new Date(dNP).toISOString(),
          //     shift: w.dispatch.shift === "nightShift" ? "N" : "D",
          //     startIndex: w.startIndex
          //       ? parseFloat(w.startIndex).toFixed(2)
          //       : // ?
          //         //   w.startIndex
          //         "0.0",
          //     millage: parseFloat(
          //       w.equipment.millage ? w.equipment.millage : 0
          //     ).toFixed(2),
          //   });
          // });

          // datesPendingPosted.map((dPP) => {
          //   siteWorkList.push({
          //     workDone: w.workDone
          //       ? w.workDone
          //       : {
          //           _id: "62690b67cf45ad62aa6144d8",
          //           jobDescription: "Others",
          //           eqType: "Truck",
          //           createdOn: "2022-04-27T09:20:50.911Z",
          //           __v: 0,
          //         },
          //     _id: w._id,
          //     status: "in progress",
          //     project: w.project,
          //     createdOn: w.createdOn,
          //     equipment: w.equipment,
          //     siteWork: w.siteWork,
          //     targetTrips: w.dispatch.targetTrips
          //       ? w.dispatch.targetTrips
          //       : "N/A",
          //     workStartDate: w.workStartDate,
          //     dispatchDate: new Date(dPP).toISOString(),
          //     shift: w.dispatch.shift === "nightShift" ? "N" : "D",
          //     startIndex: w.startIndex
          //       ? parseFloat(w.startIndex).toFixed(2)
          //       : //  ? w.startIndex
          //         "0.0",
          //     millage: parseFloat(
          //       w.equipment.millage ? w.equipment.millage : 0
          //     ).toFixed(2),
          //     // millage: w.equipment.millage ? w.equipment.millage : 0,
          //   });
          // });
        } else {
          work = {
            _id: w._id,
            driverName: w.driver?.firstName + " " + w.driver?.lastName,
            owner: w.equipment.eqOwner,
            totalRevenue: parseFloat(w.totalRevenue).toFixed(2),
            totalExpenditure: parseFloat(w.totalExpenditure).toFixed(2),
            duration:
              w.equipment.uom === "hour"
                ? w.duration / (1000 * 60 * 60)
                : w.duration,
            status: w.status,
            project: w.project,
            createdOn: w.createdOn,
            equipment: w.equipment,
            siteWork: w.siteWork,
            targetTrips: w.dispatch.targetTrips
              ? w.dispatch.targetTrips
              : "N/A",
            workStartDate: w.workStartDate,
            dispatchDate: w.siteWork ? moment().toISOString() : w.dispatch.date,
            shift: w.dispatch.shift === "nightShift" ? "N" : "D",
            startIndex: w.startIndex
              ? parseFloat(w.startIndex).toFixed(2)
              : //  ? w.startIndex
                "0.0",
            millage: parseFloat(
              w.equipment.millage ? w.equipment.millage : 0
            ).toFixed(2),
            // millage: w.equipment.millage ? w.equipment.millage : 0,
          };
        }

        return work;
      });

      let finalList = l.concat(siteWorkList);

      let orderedList = _.orderBy(finalList, "dispatchDate", "desc");

      res.status(200).send(orderedList.filter((d) => !isNull(d)));
    } catch (err) {
      res.send(err);
    }
  } else {
    res
      .send({
        error: true,
        message: "Please give all the query parameters!",
      })
      .status(204);
  }
});

router.get("/detailed/:canViewRevenues", async (req, res) => {
  let { canViewRevenues } = req.params;
  let { startDate, endDate, searchText } = req.query;

  if (canViewRevenues === true || canViewRevenues === "true") {
    try {
      let workList = await workData.model
        .find(
          {
            $and: [
              {
                $or: [
                  {
                    "equipment.plateNumber": {
                      $regex: searchText.toUpperCase(),
                    },
                  },
                  {
                    "project.prjDescription": {
                      $regex: searchText.toUpperCase(),
                    },
                  },
                ],
              },
              // {
              //   $or: [
              //     {
              //       workStartDate: { $gte: new Date(startDate) },
              //     },
              //     {
              //       workEndDate: { $lte: new Date(endDate) },
              //     },
              //   ],
              // },
            ],
          },
          {
            "project.createdOn": false,
            "equipment.__v": false,
            "equipment.createdOn": false,
            "dispatch.project": false,
            "dispatch.equipments": false,
            "driver.password": false,
            "driver.email": false,
            "driver.createdOn": false,
            "driver.__v": false,
            "driver._id": false,
          }
        )
        .populate("driver")
        .populate("appovedBy")
        .populate("createdBy")
        .populate("workDone")
        .sort([["_id", "descending"]]);

      let listToSend = workList;

      let siteWorkList = [];

      let l = listToSend.map((w) => {
        let work = null;

        if (w.siteWork && w.status !== "recalled") {
          let dailyWorks = w.dailyWork;

          let datesPosted = dailyWorks
            .filter((d) => d.pending === false)
            .map((d) => {
              return {
                date: d.date,
                duration: d.duration,
                actualRevenue: d.totalRevenue,
                expenditure: d.totalExpenditure,
              };
            });

          let datePosted_Dates = dailyWorks
            .filter((d) => d.pending === false)
            .map((d) => {
              return d.date;
            });

          let datesPendingPosted = dailyWorks
            .filter((d) => d.pending === true)

            .map((d) => {
              return d.date;
            });
          let workStartDate = moment(w.workStartDate);
          let workDurationDays = w.workDurationDays;

          let datesToPost = [workStartDate.format("DD-MMM-YYYY")];
          for (let i = 0; i < workDurationDays - 1; i++) {
            datesToPost.push(
              workStartDate.add(1, "days").format("DD-MMM-YYYY")
            );
          }

          let dateNotPosted = datesToPost.filter(
            (d) =>
              !_.includes(datePosted_Dates, d) &&
              !_.includes(datesPendingPosted, d) &&
              moment().diff(moment(d, "DD-MMM-YYYY")) >= 0
          );

          // {
          //     'Dispatch date': moment(Date.parse(w.dispatch?.date),
          //     'Dispatch Shift': w.dispatch?.shift?.toLocaleUpperCase(),
          //     'Site work': w.siteWork ? 'YES' : 'NO',
          //     'Project Description': w.project.prjDescription,
          //     'Equipment-PlateNumber': w.equipment?.plateNumber,
          //     'Equipment Type': w.equipment?.eqDescription,
          //     'Duration (HRS)':
          //       w.equipment?.uom === 'hour' ? msToTime(w.duration) : 0,
          //     'Duration (DAYS)':
          //       w.equipment?.uom === 'day'
          //         ? Math.round(w.duration * 100) / 100
          //         : 0,
          //     'Work done': w?.workDone?.jobDescription,
          //     'Other work description': w.dispatch?.otherJobType,
          // 'Driver Names': w.driver
          //   ? w?.driver?.firstName + ' ' + w?.driver?.lastName
          //   : w.equipment?.eqOwner,
          //     'Driver contacts': w.driver?.phone,
          //     'Target trips': w.dispatch?.targetTrips,
          //     'Trips done': w?.tripsDone,
          //     "Driver's/Operator's Comment": w.comment,
          //     Customer: w.project?.customer,
          //     Status: w.status,
          //   }

          datesPosted.map((dP) => {
            if (
              moment(Date.parse(dP.date)).isSameOrAfter(moment(startDate)) &&
              moment(Date.parse(dP.date)).isSameOrBefore(
                moment(endDate)
                  .add(23, "hours")
                  .add(59, "minutes")
                  .add(59, "seconds")
              )
            ) {
              siteWorkList.push({
                "Dispatch date": moment(Date.parse(dP.date)).format("M/D/YYYY"),
                "Posted On": moment(Date.parse(dP.date)).format("M/D/YYYY"),
                "Dispatch Shift": w.dispatch.shift === "nightShift" ? "N" : "D",
                "Site work?": w.siteWork,
                "Project Description": w.project?.prjDescription,
                "Equipment Plate number": w.equipment.plateNumber,
                "Equipment Type": w.equipment?.eqDescription,
                "Unit of measurement": w.equipment?.uom,
                "Duration (HRS)":
                  w.equipment?.uom === "hour"
                    ? dP.duration / (60 * 60 * 1000)
                    : 0,
                "Duration (DAYS)": w.equipment?.uom === "day" ? dP.duration : 0,
                "Work done": w?.workDone
                  ? w?.workDone?.jobDescription
                  : "Others",
                "Other work description": w.dispatch?.otherJobType,
                "Projected Revenue": w.projectedRevenue / w.workDurationDays,
                "Actual Revenue": dP.actualRevenue,
                "Vendor payment": dP.expenditure,
                "Driver Names": w.driver
                  ? w?.driver?.firstName + " " + w?.driver?.lastName
                  : w.equipment?.eqOwner,
                "Driver contacts": w.driver?.phone,
                "Target trips": w.dispatch?.targetTrips
                  ? w.dispatch?.targetTrips
                  : 0,
                "Trips done": w?.tripsDone ? w?.tripsDone : 0,
                "Driver's/Operator's Comment": dP.comment
                  ? dP.comment + " - " + (dP.moreComment ? dP.moreComment : "")
                  : " ",
                Customer: w.project?.customer,
                Status: "stopped",
              });
            }
          });

          dateNotPosted.map((dNP) => {
            if (
              moment(Date.parse(dNP.date)).isSameOrAfter(moment(startDate)) &&
              moment(Date.parse(dNP.date)).isSameOrBefore(
                moment(endDate)
                  .add(23, "hours")
                  .add(59, "minutes")
                  .add(59, "seconds")
              )
            ) {
              siteWorkList.push({
                "Dispatch date": moment(Date.parse(dNP)).format("M/D/YYYY"),
                "Posted On": "",
                "Dispatch Shift": w.dispatch.shift === "nightShift" ? "N" : "D",
                "Site work?": w.siteWork,
                "Project Description": w.project.prjDescription,
                "Equipment Plate number": w.equipment.plateNumber,
                "Equipment Type": w.equipment?.eqDescription,
                "Unit of measurement": w.equipment?.uom,
                "Duration (HRS)": 0,
                "Duration (DAYS)": 0,
                "Work done": w?.workDone
                  ? w?.workDone?.jobDescription
                  : "Others",
                "Other work description": w.dispatch?.otherJobType,
                "Projected Revenue": w.projectedRevenue / w.workDurationDays,
                "Actual Revenue": 0,
                "Vendor payment": 0,
                "Driver Names": w.driver
                  ? w?.driver?.firstName + " " + w?.driver?.lastName
                  : w.equipment?.eqOwner,
                "Driver contacts": w.driver?.phone ? w.driver?.phone : " ",
                "Target trips": w.dispatch?.targetTrips
                  ? w.dispatch?.targetTrips
                  : 0,
                "Trips done": 0,
                "Driver's/Operator's Comment": dNP.comment
                  ? dNP.comment +
                    " - " +
                    (dNP.moreComment ? dNP.moreComment : "")
                  : " ",
                Customer: w.project?.customer,
                Status: "created",
              });
            }
          });

          // console.log(siteWorkList);

          datesPendingPosted.map((dPP) => {
            if (
              moment(Date.parse(dPP.date)).isSameOrAfter(moment(startDate)) &&
              moment(Date.parse(dPP.date)).isSameOrBefore(
                moment(endDate)
                  .add(23, "hours")
                  .add(59, "minutes")
                  .add(59, "seconds")
              )
            ) {
              siteWorkList.push({
                "Dispatch date": moment(Date.parse(dPP)).format("M/D/YYYY"),
                "Posted On": "",
                "Dispatch Shift": w.dispatch.shift === "nightShift" ? "N" : "D",
                "Site work?": w.siteWork,
                "Project Description": w.project.prjDescription,
                "Equipment Plate number": w.equipment.plateNumber,
                "Equipment Type": w.equipment?.eqDescription,
                "Unit of measurement": w.equipment?.uom,
                "Duration (HRS)": 0,
                "Duration (DAYS)": 0,
                "Work done": w?.workDone
                  ? w?.workDone?.jobDescription
                  : "Others",
                "Other work description": w.dispatch?.otherJobType,
                "Projected Revenue": w.projectedRevenue / w.workDurationDays,
                "Actual Revenue": 0,
                "Vendor payment": 0,
                "Driver Names": w.driver
                  ? w?.driver?.firstName + " " + w?.driver?.lastName
                  : w.equipment?.eqOwner,
                "Driver contacts": w.driver?.phone ? w.driver?.phone : " ",
                "Target trips": w.dispatch?.targetTrips
                  ? w.dispatch?.targetTrips
                  : 0,
                "Trips done": 0,
                "Driver's/Operator's Comment": dPP.comment
                  ? dPP.comment +
                    " - " +
                    (dPP.moreComment ? dPP.moreComment : "")
                  : " ",
                Customer: w.project?.customer,
                Status: "in progress",
              });
            }
          });
        } else {
          if (
            moment(Date.parse(w.dispatch.date)).isSameOrAfter(
              moment(startDate)
            ) &&
            moment(Date.parse(w.dispatch.date)).isSameOrBefore(
              moment(endDate)
                .add(23, "hours")
                .add(59, "minutes")
                .add(59, "seconds")
            )
          ) {
            work = {
              "Dispatch date": w.siteWork
                ? moment().format("M/D/YYYY")
                : moment(Date.parse(w.dispatch.date)).format("M/D/YYYY"),
              "Posted On": moment(Date.parse(w.createdOn)).format("M/D/YYYY"),
              "Dispatch Shift": w.dispatch.shift === "nightShift" ? "N" : "D",
              "Site work?": w.siteWork,
              "Project Description": w.project.prjDescription,
              "Equipment Plate number": w.equipment.plateNumber,
              "Equipment Type": w.equipment?.eqDescription,
              "Unit of measurement": w.equipment?.uom,
              "Duration (HRS)":
                w.equipment?.uom === "hour" ? w.duration / (60 * 60 * 1000) : 0,
              "Duration (DAYS)": w.equipment?.uom === "day" ? w.duration : 0,
              "Work done": w?.workDone ? w?.workDone?.jobDescription : "Others",
              "Other work description": w.dispatch?.otherJobType,
              "Projected Revenue": w.projectedRevenue / w.workDurationDays,
              "Actual Revenue": w.totalRevenue,
              "Vendor payment": w.totalExpenditure,
              "Driver Names": w.driver
                ? w?.driver?.firstName + " " + w?.driver?.lastName
                : w.equipment?.eqOwner,
              "Driver contacts": w.driver?.phone,
              "Target trips": w.dispatch?.targetTrips,
              "Trips done": w?.tripsDone,
              "Driver's/Operator's Comment": w.comment
                ? w.comment
                : "" + " - " + (w.moreComment ? w.moreComment : ""),
              Customer: w.project?.customer,
              Status: w.status,
            };
          }
        }

        return work;
      });

      let finalList = l.concat(siteWorkList);

      let orderedList = _.orderBy(finalList, "dispatchDate", "desc");

      res.status(200).send(orderedList.filter((w) => w !== null));
    } catch (err) {
      res.send(err);
    }
  } else {
    res.send([]);
  }
});

router.get("/:id", async (req, res) => {
  let { id } = req.params;
  try {
    let work = await workData.model
      .findById(id)
      // .populate("project")
      // .populate({
      //   path: "project",
      //   populate: {
      //     path: "customer",
      //     model: "customers",
      //   },
      // })
      .populate("equipment")
      .populate("driver")
      .populate("dispatch")
      .populate("appovedBy")
      .populate("createdBy")
      .populate("workDone");

    res.status(200).send(work);
  } catch (err) {
    res.send(err);
  }
});

router.post("/", async (req, res) => {
  try {
    let workToCreate = new workData.model(req.body);

    let equipment = await eqData.model.findById(workToCreate?.equipment?._id);
    equipment.eqStatus = "dispatched";
    equipment.assignedToSiteWork = req.body?.siteWork;
    equipment.assignedDate = req.body?.dispatch?.date;
    equipment.assignedShift = req.body?.dispatch?.shift;
    let driver = req.body?.driver === "NA" ? null : req.body?.driver;

    let employee = await employeeData.model.findById(driver);
    if (employee) {
      employee.status = "dispatched";
      employee.assignedToSiteWork = req.body?.siteWork;
      employee.assignedDate = req.body?.dispatch?.date;
      employee.assignedShift = req.body?.dispatch?.shift;
    }

    let rate = parseInt(equipment.rate);
    let uom = equipment.uom;
    let revenue = 0;
    let siteWork = req.body?.siteWork;
    let workDurationDays = req.body?.workDurationDays;

    await equipment.save();
    if (employee) await employee.save();

    workToCreate.equipment = equipment;
    if (uom === "hour") revenue = rate * 5;
    if (uom === "day") revenue = rate;

    // workToCreate.totalRevenue = revenue;
    workToCreate.projectedRevenue = siteWork
      ? revenue * workDurationDays
      : revenue;

    workToCreate.driver = driver;
    let workCreated = await workToCreate.save();

    //log saving
    let log = {
      action: "DISPATCH CREATED",
      doneBy: req.body.createdBy,
      payload: workToCreate,
    };
    let logTobeSaved = new logData.model(log);
    await logTobeSaved.save();

    let today = moment().format("DD-MMM-YYYY");
    let dateData = await assetAvblty.model.findOne({ date: today });
    let dispatched = await eqData.model.find({
      eqStatus: "dispatched",
      eqOwner: "Construck",
    });

    let standby = await eqData.model.find({
      eqStatus: "standby",
      eqOwner: "Construck",
    });

    if (dateData) {
      dateData.dispatched = dispatched.length;
      dateData.standby = standby.length;

      await dateData.save();
    } else {
      let dateDataToSave = new assetAvblty.model({
        date: today,
        dispatched: dispatched.length,
        standby: standby.length,
      });

      await dateDataToSave.save();
    }

    res.status(201).send(workCreated);
  } catch (err) {
    let error = findError(err.code);
    let keyPattern = err.keyPattern;
    let key = _.findKey(keyPattern, function (key) {
      return key === 1;
    });
    res.send({
      error,
      key,
    });
  }
});

router.post("/mobileData", async (req, res) => {
  try {
    let bodyData = {
      project: JSON.parse(req.body.project),
      equipment: JSON.parse(req.body.equipment),
      workDone: req.body.workDone,
      startIndex: req.body.startIndex,
      endIndex: req.body.endIndex,
      startTime: req.body.startTime,
      endTime: req.body.endTime,
      rate: req.body.rate,
      driver: req.body.driver,
      status: req.body.status,
      duration: req.body.duration,
      comment: req.body.comment,
      siteWork: req.body.siteWork === "yes" ? true : false,
    };
    let workToCreate = new workData.model(bodyData);

    let equipment = await eqData.model.findById(workToCreate?.equipment?._id);
    if (equipment.eqStatus === "standby") {
      // Save data only when equipment is available
      equipment.eqStatus = "dispatched";
      equipment.assignedToSiteWork = true;
      equipment.assignedDate = req.body?.dispatch?.date;
      equipment.assignedShift = req.body?.dispatch?.shift;

      let driver = req.body?.driver === "NA" ? null : req.body?.driver;

      let employee = await employeeData.model.findById(driver);
      if (employee) employee.status = "dispatched";

      let rate = parseInt(equipment.rate);
      let uom = equipment.uom;
      let revenue = 0;
      let siteWork = bodyData?.siteWork;
      let workDurationDays =
        moment(bodyData.endTime).diff(moment(bodyData.startTime)) / MS_IN_A_DAY;

      await equipment.save();
      if (employee) await employee.save();

      workToCreate.equipment = equipment;
      workToCreate.workDurationDays = workDurationDays;
      if (uom === "hour") revenue = rate * 5;
      if (uom === "day") revenue = rate;

      // workToCreate.totalRevenue = revenue;
      workToCreate.projectedRevenue = siteWork
        ? revenue * workDurationDays
        : revenue;

      workToCreate.driver = driver;
      let workCreated = await workToCreate.save();

      //log saving
      let log = {
        action: "DISPATCH CREATED",
        doneBy: req.body.createdBy,
        payload: req.body,
      };

      let logTobeSaved = new logData.model(log);
      await logTobeSaved.save();

      res.status(201).send(workCreated);
    } else {
      res.status(201).send(bodyData);
    }
  } catch (err) {
    let error = findError(err.code);
    let keyPattern = err.keyPattern;
    let key = _.findKey(keyPattern, function (key) {
      return key === 1;
    });
    res.send({
      error,
      key,
    });
  }
});

router.post("/getAnalytics", async (req, res) => {
  let { startDate, endDate, status, customer, project, equipment, owner } =
    req.body;

  let total = 0;
  let totalRevenue = 0;
  let projectedRevenue = 0;
  let totalDays = 0;
  let daysDiff = _.round(
    moment(endDate).diff(moment(startDate)) / MS_IN_A_DAY,
    0
  );
  try {
    let workList = await workData.model
      .find({
        // status:
        //   status === "final"
        //     ? { $in: ["approved", "stopped"] }
        //     : {
        //         $in: [
        //           "created",
        //           "in progress",
        //           "rejected",
        //           "stopped",
        //           "on going",
        //         ],
        //       },
      })
      .or([
        { siteWork: true, workStartDate: { $gte: startDate } },
        {
          siteWork: false,
          "dispatch.date": {
            $gte: startDate,
            $lte: moment(endDate)
              .add(23, "hours")
              .add(59, "minutes")
              .add(59, "seconds")
              .toISOString(),
          },
        },
      ]);

    if (workList && workList.length > 0) {
      total = 0;

      let list = [];

      if (customer) {
        list = workList.filter((w) => {
          let nameLowerCase = w?.project?.customer?.toLowerCase();
          return nameLowerCase.includes(customer?.toLowerCase());
        });
      } else {
        list = workList;
      }

      if (project) {
        list = list.filter((w) => {
          let descLowerCase = w?.project?.prjDescription?.toLowerCase();
          return descLowerCase.includes(project.toLowerCase());
        });
      }

      if (equipment) {
        list = list.filter((w) => {
          let plateLowerCase = w?.equipment?.plateNumber?.toLowerCase();
          return plateLowerCase.includes(equipment.toLowerCase());
        });
      }

      if (owner) {
        list = list.filter((w) => {
          let ownerLowercase = w?.equipment?.eqOwner?.toLowerCase();
          if (owner.toLowerCase() === "construck")
            return ownerLowercase === "construck";
          else if (owner.toLowerCase() === "hired")
            return ownerLowercase !== "construck";
          else return true;
        });
      }

      list.map((w) => {
        //PStart and PEnd are before range stare
        let case1 =
          moment(w.workStartDate).diff(moment(startDate)) < 0 &&
          moment(w.workEndDate).diff(
            moment(endDate)
              .add(23, "hours")
              .add(59, "minutes")
              .add(59, "seconds")
          ) < 0;

        //PStart before Start and PEnd after Start and PEnd before End
        let case2 =
          moment(w.workStartDate).diff(moment(startDate)) < 0 &&
          moment(w.workEndDate).diff(moment(startDate)) > 0 &&
          moment(w.workEndDate).diff(
            moment(endDate)
              .add(23, "hours")
              .add(59, "minutes")
              .add(59, "seconds")
          ) < 0;

        //PStart before to Start and PEnd After end
        // OR
        //PStart equal to Start and PEnd equal End
        //OR
        //PStart equal to Start and PEnd after End
        let case3 =
          moment(w.workStartDate).diff(moment(startDate)) <= 0 &&
          moment(w.workEndDate).diff(
            moment(endDate)
              .add(23, "hours")
              .add(59, "minutes")
              .add(59, "seconds")
          ) >= 0;

        //PStart after Start and PEnd before Start
        let case4 =
          moment(w.workStartDate).diff(moment(startDate)) > 0 &&
          moment(w.workEndDate).diff(
            moment(endDate)
              .add(23, "hours")
              .add(59, "minutes")
              .add(59, "seconds")
          ) < 0;

        //PStart after Start and PEnd after End
        let case5 =
          moment(w.workStartDate).diff(moment(startDate)) > 0 &&
          moment(w.workEndDate).diff(
            moment(endDate)
              .add(23, "hours")
              .add(59, "minutes")
              .add(59, "seconds")
          ) > 0 &&
          moment(endDate).diff(moment(w.workStartDate)) > 0;

        if (case1) daysDiff = 0;
        else if (case2)
          daysDiff = _.round(
            moment(w.workEndDate).diff(moment(startDate), "days"),
            0
          );
        else if (case3)
          daysDiff = _.round(
            moment(endDate).diff(moment(startDate), "days"),
            0
          );
        else if (case4)
          daysDiff = _.round(
            moment(w.workEndDate).diff(moment(w.workStartDate), "days"),
            0
          );
        else if (case5)
          daysDiff = _.round(
            moment(endDate).diff(moment(w.workStartDate), "days"),
            0
          );
        else
          daysDiff = _.round(
            moment(endDate).diff(moment(startDate), "days"),
            0
          );

        if (daysDiff < 0) daysDiff = 0;

        let isSiteWork = w.siteWork;
        let datesWithRevenue = [];

        if (isSiteWork) {
          let dailyWork = w.dailyWork;

          let postedDates = dailyWork.filter((d) => d.pending === false);
          postedDates?.map((p) => {
            if (
              moment(p.date, "DD-MMM-YYYY").isSameOrAfter(moment(startDate)) &&
              moment(p.date, "DD-MMM-YYYY").isSameOrBefore(
                moment(endDate)
                  .add(23, "hours")
                  .add(59, "minutes")
                  .add(59, "seconds")
              )
            ) {
              totalRevenue = totalRevenue + p.totalRevenue;
            }
          });
        } else {
          if (
            moment(w.dispatch.date).isSameOrAfter(moment(startDate)) &&
            moment(w.dispatch.date).isSameOrBefore(
              moment(endDate)
                .add(23, "hours")
                .add(59, "minutes")
                .add(59, "seconds")
            )
          ) {
            totalRevenue = totalRevenue + w.totalRevenue;
          }
        }

        projectedRevenue =
          w.siteWork === true
            ? projectedRevenue +
              w?.equipment.rate *
                (w?.equipment.uom === "hour" ? 5 * daysDiff + 1 : daysDiff + 1)
            : projectedRevenue + w?.projectedRevenue;

        if (isNaN(projectedRevenue)) projectedRevenue = 0;
      });
    }

    let workListByDay = await workData.model
      .find({ uom: "day" })
      .and([{ "dispatch.date": { $gte: startDate, $lte: endDate } }]);

    let listDays = [];

    if (customer) {
      listDays = workListByDay.filter((w) => {
        let nameLowerCase = w?.project?.customer?.toLowerCase();
        return nameLowerCase.includes(customer?.toLowerCase());
      });
    } else {
      listDays = workListByDay;
    }

    if (project) {
      listDays = listDays.filter((w) => {
        let descLowerCase = w?.project?.prjDescription?.toLowerCase();
        return descLowerCase.includes(project.toLowerCase());
      });
    }

    if (equipment) {
      listDays = listDays.filter((w) => {
        let plateLowerCase = w?.equipment?.plateNumber?.toLowerCase();
        return plateLowerCase.includes(equipment.toLowerCase());
      });
    }

    if (owner) {
      listDays = listDays.filter((w) => {
        let ownerLowercase = w?.equipment?.eqOwner?.toLowerCase();
        if (owner.toLowerCase() === "construck")
          return ownerLowercase === "construck";
        else if (owner.toLowerCase() === "hired")
          return ownerLowercase !== "construck";
        else return true;
      });
    }

    listDays.map((w) => {
      totalDays = totalDays + w.duration;
    });

    let dispatches = await workData.model.find({
      createdOn: { $gte: startDate, $lte: endDate },
    });

    let listDispaches = [];
    if (customer) {
      listDispaches = dispatches.filter((w) => {
        let nameLowerCase = w?.project?.customer?.toLowerCase();
        return nameLowerCase.includes(customer?.toLowerCase());
      });
    } else {
      listDispaches = dispatches;
    }

    res.status(200).send({
      totalRevenue: _.round(totalRevenue, 0).toFixed(2),
      projectedRevenue: projectedRevenue.toFixed(2),
      totalDays: _.round(totalDays, 1).toFixed(1),
    });
  } catch (err) {
    let error = findError(err.code);
    let keyPattern = err.keyPattern;
    let key = _.findKey(keyPattern, function (key) {
      return key === 1;
    });
    res.send({
      error,
      key,
    });
  }
});

router.put("/approve/:id", async (req, res) => {
  let { id } = req.params;
  try {
    let work = await workData.model
      .findById(id)
      .populate("project")
      .populate("equipment")
      .populate("driver")
      .populate("dispatch")
      .populate("appovedBy");

    let eqId = work?.equipment?._id;
    await workData.model.updateMany(
      { "equipment._id": eqId },
      {
        $set: { eqStatus: "standby", assignedDate: null, assignedShift: "" },
      }
    );

    let equipment = await eqData.model.findById(work?.equipment?._id);
    equipment.eqStatus = "standby";
    equipment.assignedDate = null;
    equipment.assignedShift = "";

    work.status = "approved";

    let savedRecord = await work.save();
    await equipment.save();
    res.status(201).send(savedRecord);
  } catch (err) {}
});

router.put("/recall/:id", async (req, res) => {
  let { id } = req.params;
  try {
    let work = await workData.model.findById(id);

    let employee = await employeeData.model.findById(work?.driver);
    if (employee) {
      employee.status = "active";
      employee.assignedToSiteWork = false;
      employee.assignedDate = null;
      employee.assignedShift = "";
    }

    let eqId = work?.equipment?._id;
    await workData.model.updateMany(
      { "equipment._id": eqId },
      {
        $set: { eqStatus: "standby", assignedDate: null, assignedShift: "" },
      }
    );

    let equipment = await eqData.model.findById(work?.equipment?._id);
    equipment.eqStatus = "standby";
    equipment.assignedDate = null;
    equipment.assignedShift = "";
    equipment.assignedToSiteWork = false;

    work.status = "recalled";
    work.equipment = equipment;
    work.projectedRevenue = 0;
    work.totalRevenue = 0;

    let savedRecord = await work.save();

    await equipment.save();
    if (employee) await employee.save();

    //log saving
    let log = {
      action: "DISPATCH RECALLED",
      doneBy: req.body.recalledBy,
      payload: work,
    };
    let logTobeSaved = new logData.model(log);
    await logTobeSaved.save();

    let today = moment().format("DD-MMM-YYYY");
    const dateData = await assetAvblty.model.findOne({ date: today });
    let availableAssets = await eqData.model.find({
      eqStatus: { $ne: "workshop" },
      eqOwner: "Construck",
    });
    let unavailableAssets = await eqData.model.find({
      eqStatus: "workshop",
      eqOwner: "Construck",
    });
    let dispatched = await eqData.model.find({
      eqStatus: "dispatched",
      eqOwner: "Construck",
    });

    let standby = await eqData.model.find({
      eqStatus: "standby",
      eqOwner: "Construck",
    });

    if (dateData) {
      let currentAvailable = dateData.available;
      let currentUnavailable = dateData.unavailable;
      dateData.available = currentAvailable;
      dateData.unavailable = currentUnavailable;
      dateData.dispatched = dispatched.length;
      dateData.standby = standby.length;

      await dateData.save();
    } else {
      let dateDataToSave = new assetAvblty.model({
        date: today,
        available: availableAssets.length,
        unavailable: unavailableAssets.length,
        dispatched: dispatched.length,
        standby: standby.length,
      });
      await dateDataToSave.save();
    }

    res.status(201).send(savedRecord);
  } catch (err) {}
});

router.put("/reject/:id", async (req, res) => {
  let { id } = req.params;
  let { reasonForRejection } = req.body;
  try {
    let work = await workData.model
      .findById(id)
      .populate("project")
      .populate("equipment")
      .populate("driver")
      .populate("dispatch")
      .populate("appovedBy")
      .populate("workDone");

    work.status = "rejected";
    work.reasonForRejection = reasonForRejection;
    work.totalRevenue = 0;
    // work.projectedRevenue = 0;

    let eqId = work?.equipment?._id;
    await workData.model.updateMany(
      { "equipment._id": eqId },
      {
        $set: { eqStatus: "standby", assignedDate: null, assignedShift: "" },
      }
    );
    let equipment = await eqData.model.findById(work?.equipment?._id);
    equipment.eqStatus = "standby";
    equipment.assignedDate = null;
    equipment.assignedShift = "";

    let savedRecord = await work.save();
    await equipment.save();
    res.status(201).send(savedRecord);
  } catch (err) {}
});

router.put("/start/:id", async (req, res) => {
  let { id } = req.params;
  let { startIndex, postingDate } = req.body;

  let dd = postingDate?.split(".")[0];
  let mm = postingDate?.split(".")[1];
  let yyyy = postingDate?.split(".")[2];

  if (dd?.length < 2) dd = "0" + dd;
  if (mm?.length < 2) mm = "0" + mm;

  if (dd && mm && yyyy) postingDate = `${yyyy}-${mm}-${dd}`;
  try {
    let work = await workData.model
      .findById(id)
      .populate("project")
      .populate("equipment")
      .populate("driver")
      .populate("dispatch")
      .populate("appovedBy")
      .populate("workDone");

    if (work.status === "created" || work.status === "on going") {
      let eqId = work?.equipment?._id;

      await workData.model.updateMany(
        { "equipment._id": eqId },
        {
          $set: {
            eqStatus: "in progress",
            assignedDate: Date.now(),
            millage: startIndex,
          },
        }
      );

      let equipment = await eqData.model.findById(work?.equipment?._id);
      equipment.assignedToSiteWork = true;
      equipment.millage = startIndex;

      let employee = await employeeData.model.findById(work?.driver);
      if (employee) {
        employee.status = "busy";
      }

      if (work.siteWork) {
        let dailyWork = {
          day: moment(postingDate).isValid()
            ? moment(postingDate).diff(moment(work.workStartDate), "days")
            : moment(postingDate, "DD.MM.YYYY").diff(
                moment(work.workStartDate),
                "days"
              ),
          startTime: postingDate,
          date: moment(postingDate).isValid()
            ? moment(postingDate).format("DD-MMM-YYYY")
            : moment(postingDate, "DD.MM.YYYY").format("DD-MMM-YYYY"),
          startIndex,
          pending: true,
        };

        work.dailyWork.push(dailyWork);
        work.status = "in progress";
        work.startIndex = startIndex;
        work.equipment = equipment;
        let savedRecord = await work.save();
        if (employee) await employee.save();

        //log saving
        let log = {
          action: "DISPATCH STARTED",
          doneBy: req.body.startedBy,
          request: req.body,
          payload: work,
        };
        let logTobeSaved = new logData.model(log);
        await logTobeSaved.save();

        res.status(201).send(savedRecord);
      } else {
        work.status = "in progress";
        work.startTime = Date.now();
        work.startIndex = startIndex;
        work.equipment = equipment;
        let savedRecord = await work.save();

        if (employee) await employee.save();
        await equipment.save();

        //log saving
        let log = {
          action: "DISPATCH STARTED",
          doneBy: req.body.startedBy,
          request: req.body,
          payload: work,
        };
        let logTobeSaved = new logData.model(log);
        await logTobeSaved.save();

        res.status(201).send(savedRecord);
      }
    } else {
      res.status(200).send(work);
    }
  } catch (err) {}
});

router.put("/stop/:id", async (req, res) => {
  let { id } = req.params;
  let { endIndex, tripsDone, comment, moreComment, postingDate, stoppedBy } =
    req.body;
  let duration = Math.abs(req.body.duration);
  if (duration > 12) duration = 12;

  let dd = postingDate?.split(".")[0];
  let mm = postingDate?.split(".")[1];
  let yyyy = postingDate?.split(".")[2];
  if (dd?.length < 2) dd = "0" + dd;
  if (mm?.length < 2) mm = "0" + mm;
  if (dd && mm && yyyy) postingDate = `${yyyy}-${mm}-${dd}`;
  try {
    let work = await workData.model
      .findById(id)
      .populate("project")
      .populate("equipment")
      .populate("driver")
      .populate("appovedBy")
      .populate("dispatch")
      .populate("workDone");

    //You can only stop jobs in progress
    if (work.status === "in progress") {
      let equipment = await eqData.model.findById(work?.equipment?._id);
      let workEnded = equipment.eqStatus === "standby" ? true : false;

      //get jobs being done by the same equipment
      let eqBusyWorks = await workData.model.find({
        "equipment.plateNumber": equipment._id,
        _id: { $ne: work._id },
        status: { $in: ["in progress", "on going", "created"] },
      });

      if (work?.dailyWork?.length >= work.workDurationDays) {
        equipment.eqStatus = eqBusyWorks.length >= 1 ? "dispatched" : "standby";
        equipment.assignedToSiteWork = false;
      }

      let employee = await employeeData.model.findById(work?.driver);
      if (employee) {
        employee.status = "active";
        employee.assignedToSiteWork = false;
        employee.assignedDate = null;
        employee.assignedShift = "";
      }

      if (work.siteWork) {
        let dailyWork = {};
        let currentTotalRevenue = work.totalRevenue;
        let currentDuration = Math.abs(work.duration);
        let currentTotalExpenditure = work.totalExpenditure;

        work.status =
          workEnded || work?.dailyWork?.length >= work.workDurationDays
            ? "stopped"
            : "on going";

        let _duration = Math.abs(work.endTime - work.startTime);

        let startIndex = work.startIndex ? work.startIndex : 0;
        dailyWork.endIndex = endIndex
          ? parseInt(endIndex)
          : parseInt(startIndex);
        dailyWork.startIndex = parseInt(startIndex);

        equipment.millage =
          endIndex || startIndex !== 0
            ? parseInt(endIndex)
            : parseInt(startIndex);

        let uom = equipment?.uom;
        let rate = equipment?.rate;
        let supplierRate = equipment?.supplierRate;
        let revenue = 0;
        let expenditure = 0;

        // if rate is per hour and we have target trips to be done
        if (uom === "hour") {
          if (comment !== "Ibibazo bya panne") {
            dailyWork.duration = duration > 0 ? duration * 3600000 : 0;

            revenue = (rate * dailyWork.duration) / 3600000;
            expenditure = (supplierRate * dailyWork.duration) / 3600000;
          } else {
            dailyWork.duration = duration > 0 ? duration * 3600000 : 0;
            revenue = (rate * dailyWork.duration) / 3600000;
            expenditure = (supplierRate * dailyWork.duration) / 3600000;
          }
        }

        //if rate is per day
        if (uom === "day") {
          // work.duration = duration;
          // revenue = rate * duration;
          if (comment !== "Ibibazo bya panne") {
            dailyWork.duration = duration / HOURS_IN_A_DAY;
            revenue = rate * (duration >= 1 ? 1 : 0);
            expenditure = supplierRate * (duration >= 1 ? 1 : 0);
          } else {
            dailyWork.duration = duration / HOURS_IN_A_DAY;

            let targetDuration = 5;
            let durationRation =
              duration >= 5 ? 1 : _.round(duration / targetDuration, 2);
            dailyWork.duration = duration / HOURS_IN_A_DAY;
            revenue = rate * (duration >= 1 ? 1 : 0);
            expenditure = supplierRate;
          }
        }

        dailyWork.rate = rate;
        dailyWork.uom = uom;
        dailyWork.date = moment(postingDate).isValid()
          ? moment(postingDate).format("DD-MMM-YYYY")
          : moment(postingDate, "DD.MM.YYYY").format("DD-MMM-YYYY");
        dailyWork.totalRevenue = revenue ? revenue : 0;
        dailyWork.totalExpenditure = expenditure ? expenditure : 0;
        dailyWork.comment = comment;
        dailyWork.moreComment = moreComment;
        dailyWork.pending = false;

        let dailyWorks = [...work.dailyWork];

        let indexToUpdate = -1;
        let workToUpdate = dailyWorks.find((d, index) => {
          d.day == moment().diff(moment(work.workStartDate), "days");
          indexToUpdate = index;
        });

        dailyWorks[indexToUpdate] = dailyWork;

        work.startIndex =
          endIndex || startIndex !== 0
            ? parseInt(endIndex)
            : parseInt(startIndex);
        work.dailyWork = dailyWorks;
        work.duration = dailyWork.duration + currentDuration;
        work.totalRevenue = currentTotalRevenue + revenue;
        if (workEnded) work.projectedRevenue = currentTotalRevenue + revenue;
        work.totalExpenditure = currentTotalExpenditure + expenditure;
        work.equipment = equipment;
        work.moreComment = moreComment;

        await equipment.save();
        if (employee) await employee.save();
        let savedRecord = await work.save();

        //log saving
        let log = {
          action: "DISPATCH STOPPED",
          doneBy: stoppedBy,
          request: req.body,
          payload: work,
        };
        let logTobeSaved = new logData.model(log);
        await logTobeSaved.save();

        res.status(201).send(savedRecord);
      } else {
        let eqId = work?.equipment?._id;
        await workData.model.updateMany(
          { "equipment._id": eqId },
          {
            $set: {
              eqStatus: "standby",
              assignedDate: null,
              assignedShift: "",
            },
          }
        );
        let startIndex = work.startIndex ? work.startIndex : 0;
        let equipment = await eqData.model.findById(work?.equipment?._id);
        equipment.eqStatus = eqBusyWorks.length >= 1 ? "dispatched" : "standby";
        equipment.assignedDate =
          eqBusyWorks.length >= 1 ? equipment.assignedDate : null;
        equipment.assignedShift =
          eqBusyWorks.length >= 1 ? equipment.assignedShift : "";
        equipment.assignedToSiteWork =
          eqBusyWorks.length >= 1 ? equipment.assignedToSiteWork : false;
        equipment.millage =
          endIndex || startIndex !== 0
            ? parseInt(endIndex)
            : parseInt(startIndex);

        work.status = "stopped";
        work.endTime = Date.now();
        let _duration = Math.abs(work.endTime - work.startTime);

        work.endIndex =
          endIndex || startIndex !== 0
            ? parseInt(endIndex)
            : parseInt(startIndex);
        work.startIndex = parseInt(startIndex);
        work.tripsDone = parseInt(tripsDone);
        let uom = equipment?.uom;

        let rate = equipment?.rate;
        let supplierRate = equipment?.supplierRate;
        let targetTrips = parseInt(work?.dispatch?.targetTrips); //TODO

        let tripsRatio = tripsDone / (targetTrips ? targetTrips : 1);
        let revenue = 0;
        let expenditure = 0;

        // if rate is per hour and we have target trips to be done
        if (uom === "hour") {
          if (comment !== "Ibibazo bya panne") {
            work.duration = duration > 0 ? duration * 3600000 : 0;
            revenue = (rate * work.duration) / 3600000;
            expenditure = (supplierRate * work.duration) / 3600000;
          } else {
            work.duration = duration > 0 ? duration * 3600000 : 0;
            revenue = (tripsRatio * (rate * work.duration)) / 3600000;
            expenditure =
              (tripsRatio * (supplierRate * work.duration)) / 3600000;
          }
        }

        //if rate is per day
        if (uom === "day") {
          // work.duration = duration;
          // revenue = rate * duration;
          if (comment !== "Ibibazo bya panne") {
            work.duration = duration / HOURS_IN_A_DAY;
            revenue = rate * (duration >= 1 ? 1 : 0);
            expenditure = supplierRate * (duration >= 1 ? 1 : 0);
          } else {
            work.duration = duration / HOURS_IN_A_DAY;
            let tripRatio = tripsDone / targetTrips;
            if (tripsDone && targetTrips) {
              if (tripRatio > 1) {
                revenue = rate;
                expenditure = supplierRate;
                // revenue = rate;
              } else {
                revenue = rate * tripRatio;
                expenditure = supplierRate * tripRatio;
              }
            }
            if (!targetTrips || targetTrips == "0") {
              {
                let targetDuration = 5;
                let durationRation =
                  duration >= 5 ? 1 : _.round(duration / targetDuration, 2);
                work.duration = duration / HOURS_IN_A_DAY;
                revenue = rate;
                expenditure = supplierRate;
              }
            }
          }
        }

        work.rate = rate;
        work.uom = uom;
        work.totalRevenue = revenue ? revenue : 0;
        work.totalExpenditure = expenditure ? expenditure : 0;
        work.comment = comment;
        work.moreComment = moreComment;
        work.equipment = equipment;

        let savedRecord = await work.save();
        if (employee) await employee.save();
        await equipment.save();

        //log saving
        let log = {
          action: "DISPATCH STOPPED",
          doneBy: stoppedBy,
          request: req.body,
          payload: work,
        };
        let logTobeSaved = new logData.model(log);
        await logTobeSaved.save();

        let today = moment().format("DD-MMM-YYYY");
        const dateData = await assetAvblty.model.findOne({ date: today });
        let availableAssets = await eqData.model.find({
          eqStatus: { $ne: "workshop" },
          eqOwner: "Construck",
        });
        let unavailableAssets = await eqData.model.find({
          eqStatus: "workshop",
          eqOwner: "Construck",
        });
        let dispatched = await eqData.model.find({
          eqStatus: "dispatched",
          eqOwner: "Construck",
        });

        let standby = await eqData.model.find({
          eqStatus: "standby",
          eqOwner: "Construck",
        });

        if (dateData) {
          let currentAvailable = dateData.available;
          let currentUnavailable = dateData.unavailable;
          dateData.available = currentAvailable;
          dateData.unavailable = currentUnavailable;
          dateData.dispatched = dispatched.length;
          dateData.standby = standby.length;

          await dateData.save();
        } else {
          let dateDataToSave = new assetAvblty.model({
            date: today,
            available: availableAssets.length,
            unavailable: unavailableAssets.length,
            dispatched: dispatched.length,
            standby: standby.length,
          });
          await dateDataToSave.save();
        }

        res.status(201).send(savedRecord);
      }
    } else {
      res.status(200).send(work);
    }
  } catch (err) {}
});

router.put("/end/:id", async (req, res) => {
  let { id } = req.params;

  try {
    let work = await workData.model
      .findById(id)
      .populate("project")
      .populate("equipment")
      .populate("driver")
      .populate("appovedBy")
      .populate("dispatch")
      .populate("workDone");

    let equipment = await eqData.model.findById(work?.equipment?._id);

    let employee = await employeeData.model.findById(work?.driver);
    if (employee) {
      employee.status = "active";
      employee.assignedToSiteWork = false;
      employee.assignedDate = null;
      employee.assignedShift = "";
    }

    if (work.siteWork) {
      // work.status = "stopped";
      equipment.eqStatus = "standby";
      equipment.assignedDate = null;
      equipment.assignedShift = "";

      // work.projectedRevenue = work.totalRevenue;
      work.equipment = equipment;

      await equipment.save();
      if (employee) await employee.save();
      let savedRecord = await work.save();

      //log saving
      let log = {
        action: "SITE WORK ENDED",
        doneBy: req.body.stoppedBy,
        payload: work,
      };
      let logTobeSaved = new logData.model(log);
      await logTobeSaved.save();

      let today = moment().format("DD-MMM-YYYY");
      const dateData = await assetAvblty.model.findOne({ date: today });
      let availableAssets = await eqData.model.find({
        eqStatus: { $ne: "workshop" },
        eqOwner: "Construck",
      });
      let unavailableAssets = await eqData.model.find({
        eqStatus: "workshop",
        eqOwner: "Construck",
      });
      let dispatched = await eqData.model.find({
        eqStatus: "dispatched",
        eqOwner: "Construck",
      });

      let standby = await eqData.model.find({
        eqStatus: "standby",
        eqOwner: "Construck",
      });

      if (dateData) {
        let currentAvailable = dateData.available;
        let currentUnavailable = dateData.unavailable;
        dateData.available = currentAvailable;
        dateData.unavailable = currentUnavailable;
        dateData.dispatched = dispatched.length;
        dateData.standby = standby.length;

        await dateData.save();
      } else {
        let dateDataToSave = new assetAvblty.model({
          date: today,
          available: availableAssets.length,
          unavailable: unavailableAssets.length,
          dispatched: dispatched.length,
          standby: standby.length,
        });
        await dateDataToSave.save();
      }
      res.status(201).send(savedRecord);
    }
  } catch (err) {}
});

router.put("/resetStartIndices", async (req, res) => {
  try {
    let updates = await workData.model.updateMany({
      $set: {
        startIndex: 0,
        endIndex: 0,
      },
    });

    res.send(updates);
  } catch (err) {}
});

router.put("/reverse/:id", async (req, res) => {
  // reset duration
  // reset totalRevenue
  // only those that are not site works
  // set status to "in progress"
  // create a log to mention that it is a reverse

  let { id } = req.params;
  let { reversedBy } = req.body;
  try {
    let work = await workData.model
      .findById(id)
      .populate("project")
      .populate("equipment")
      .populate("driver")
      .populate("appovedBy")
      .populate("dispatch")
      .populate("workDone");

    work.duration = 0;
    work.totalRevenue = 0;
    work.tripsDone = 0;
    work.status = "created";

    //log saving
    let log = {
      action: "DISPATCH REVERSED",
      doneBy: reversedBy,
      payload: work,
    };
    let logTobeSaved = new logData.model(log);

    await logTobeSaved.save();
    await work.save();

    res.send(work).status(201);
  } catch (err) {}
});

router.put("/swreverse/:id", async (req, res) => {
  // reset duration
  // reset totalRevenue
  // only those that are not site works
  // set status to "in progress"
  // create a log to mention that it is a reverse

  let { id } = req.params;
  let { date, duration, totalRevenue, totalExpenditure } = req.query;
  let { reversedBy } = req.body;

  try {
    let work = await workData.model.findOne({
      _id: id,
      "dailyWork.date": moment(date).format("DD-MMM-YYYY"),
      status: { $in: ["on going", "stopped"] },
    });

    let updatedDuration = work.duration - duration;
    let updatedRevenue = work.totalRevenue - totalRevenue;
    let updatedExpenditure = work.totalExpenditure - totalExpenditure;

    work = await workData.model.findOneAndUpdate(
      {
        _id: id,
        "dailyWork.date": moment(date).format("DD-MMM-YYYY"),
        status: { $in: ["on going", "stopped"] },
      },
      {
        $pull: {
          dailyWork: {
            date: moment(date).format("DD-MMM-YYYY"),
          },
        },
      }
    );

    work.totalRevenue = updatedRevenue;
    work.totalExpenditure = updatedExpenditure;
    work.duration = updatedDuration;

    // let _dailyWorks = work.dailyWork;

    // _.remove(_dailyWorks, function (d) {
    //   return d.date === moment(date).format("DD-MMM-YYYY");
    // });

    // work.dailyWork = _dailyWorks;

    //log saving
    let log = {
      action: "DISPATCH REVERSED",
      doneBy: reversedBy,
      payload: work,
    };
    let logTobeSaved = new logData.model(log);

    await logTobeSaved.save();
    await work.save();

    res.send(work).status(201);
  } catch (err) {
    res.send(err);
  }
});

router.post("/gethoursperdriver/", async (req, res) => {
  let { startDate, endDate } = req.body;

  try {
    let works = await workData.model.aggregate([
      {
        $match: {
          $and: [
            { driver: { $ne: null } },
            { workStartDate: { $gte: new Date(startDate) } },
            { workEndDate: { $lte: new Date(endDate) } },
          ],
          // workEndDate: { $lte: endDate },
        },
      },
      // {
      //   $unwind: "$dispatch.drivers",
      // },
      {
        $group: {
          _id: {
            driver: "$driver",
            assistants: "$dispatch.astDriver",
            uom: "$equipment.uom",
          },
          totalDuration: { $sum: "$duration" },
        },
      },

      {
        $lookup: {
          from: "employees",
          let: { driverObjId: { $toObjectId: "$_id.driver" } },
          pipeline: [
            { $addFields: { employeeId: "$_id" } },
            { $match: { $expr: { $eq: ["$employeeId", "$$driverObjId"] } } },
          ],
          as: "driverDetails",
        },
      },

      {
        $lookup: {
          from: "employees",
          let: { assistants: "$_id.assistants" },
          pipeline: [
            { $addFields: { assistantId: { $toString: "$_id" } } },
            {
              $match: {
                $expr: {
                  $in: ["$assistantId", "$$assistants"],
                },
              },
            },
            { $project: { firstName: 1, lastName: 1 } },
          ],
          as: "assistantDetails",
        },
      },
    ]);

    let refinedData = works
      .map((w) => {
        return {
          "Main Driver":
            w.driverDetails[0]?.firstName + " " + w.driverDetails[0]?.lastName,
          Drivers: w.assistantDetails,
          Phone: w.driverDetails[0]?.phone,
          "Total Duration":
            w._id.uom === "day"
              ? w.totalDuration
              : w.totalDuration / (1000 * 60 * 60),
          "Unit of measurement": w._id.uom,
        };
      })
      .filter((w) => w["Main Driver"] !== "undefined undefined");

    res.send(refinedData);
  } catch (err) {
    res.send(err);
  }
});

router.put("/driverassistants/", async (req, res) => {
  try {
    let driversData = await workData.model.find(
      { driver: { $ne: null } },
      { "dispatch.drivers": 1 }
    );
    let allAssistants = [];

    driversData.map((d) => {
      let assisList = d.dispatch.drivers;
      allAssistants = allAssistants.concat(assisList);
    });
    let uniqueAssistants = [...new Set(allAssistants)];
    let list = await getEmployees(uniqueAssistants);
    res.send(list);
  } catch (err) {}
});

async function getEmployees(listIds) {
  let list = [];
  for (let i = 0; i < listIds.length; i++) {
    if (listIds[i] !== "NA") {
      try {
        let employee = await employeeData.model.findById(listIds[i]);
        list.push({
          _id: employee._id,
          firstName: employee.firstName,
          lastName: employee.lastName,
        });
      } catch (err) {}
    }
  }

  return list;
}
module.exports = router;
