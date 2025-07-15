const Event = require("../models/eventModel");
const Registration = require("../models/registrationModel");

exports.showRegisterEvent = async (req, res) => {
  if (req.session.role !== "student") {
    return res.status(403).send("Access denied");
  }
  try {
    const events = await Event.find();
    console.log("Events found:", events); // Debug
    const registrations = await Registration.find({
      studentId: req.session.userId,
    });
    const registeredEventIds = registrations.map((r) => r.eventId.toString());
    res.render("registerEvent", { events, registeredEventIds });
  } catch (err) {
    console.error("Event fetch error:", err);
    res.status(500).send("Server error");
  }
};
