const Event = require('../models/eventModel');
const Registration = require('../models/registrationModel');
const mongoose = require('mongoose');

exports.registerEvent = async (req, res) => {
  if (req.session.role !== 'student') {
    console.log('Register access denied: userId=', req.session.userId, 'role=', req.session.role);
    return res.status(403).send('Access denied');
  }
  const { eventId } = req.body;
  console.log('Received eventId:', eventId);
  try {
    if (!mongoose.Types.ObjectId.isValid(eventId)) {
      console.log('Invalid eventId format:', eventId);
      return res.status(400).send('Invalid event ID');
    }
    const event = await Event.findById(eventId);
    if (!event) {
      console.log('Event not found for eventId:', eventId);
      return res.status(404).send('Event not found');
    }
    console.log('Found event:', event);
    if (event.registeredCount >= event.capacity) {
      return res.status(400).send('Event is full');
    }
    const existingRegistration = await Registration.findOne({ studentId: req.session.userId, eventId });
    if (existingRegistration) {
      return res.status(400).send('Already registered');
    }
    const registration = new Registration({
      studentId: req.session.userId,
      eventId
    });
    await registration.save();
    await Event.findByIdAndUpdate(eventId, { $inc: { registeredCount: 1 } });
    res.redirect('/events/register');
  } catch (err) {
    console.error('Registration error:', err);
    res.status(500).send('Server error');
  }
};

exports.cancelRegistration = async (req, res) => {
  console.log('Cancel request received: session=', req.session);
  if (!req.session.userId || req.session.role !== 'student') {
    console.log('Cancel access denied: userId=', req.session.userId, 'role=', req.session.role);
    return res.status(403).send('Access denied');
  }
  const { eventId } = req.body;
  console.log('Cancel request: userId=', req.session.userId, 'eventId=', eventId);
  try {
    if (!mongoose.Types.ObjectId.isValid(eventId)) {
      console.log('Invalid eventId format:', eventId);
      return res.status(400).send('Invalid event ID');
    }
    const registration = await Registration.findOne({ 
      studentId: req.session.userId, 
      eventId 
    });
    if (!registration) {
      console.log('Registration not found for userId=', req.session.userId, 'eventId=', eventId);
      return res.render('registerEvent', {
        events: await Event.find(),
        registeredEventIds: (await Registration.find({ studentId: req.session.userId })).map(r => r.eventId.toString()),
        error: 'Registration not found. You are not registered for this event.'
      });
    }
    await Registration.deleteOne({ _id: registration._id });
    await Event.findByIdAndUpdate(eventId, { $inc: { registeredCount: -1 } });
    console.log('Registration cancelled:', registration);
    res.redirect('/events/register');
  } catch (err) {
    console.error('Cancel error:', err);
    res.status(500).send('Server error');
  }
};

exports.listRegistrations = async (req, res) => {
  if (req.session.role !== 'admin') {
    console.log('List access denied: userId=', req.session.userId, 'role=', req.session.role);
    return res.status(403).send('Access denied');
  }
  try {
    const registrations = await Registration.find()
      .populate('studentId', 'username')
      .populate('eventId', 'name');
    const validRegistrations = registrations.filter(reg => reg.studentId && reg.eventId);
    console.log('Registrations fetched:', registrations);
    console.log('Valid registrations:', validRegistrations);
    res.render('listRegistrations', { registrations: validRegistrations });
  } catch (err) {
    console.error('List registrations error:', err);
    res.status(500).send('Server error');
  }
};

exports.searchRegistrations = async (req, res) => {
  if (req.session.role !== 'admin') {
    console.log('Search access denied: userId=', req.session.userId, 'role=', req.session.role);
    return res.status(403).send('Access denied');
  }
  const { query } = req.query;
  try {
    const registrations = await Registration.find()
      .populate({
        path: 'studentId',
        match: { username: { $regex: query || '', $options: 'i' } }
      })
      .populate('eventId', 'name');
    const filteredRegistrations = registrations.filter(r => r.studentId && r.eventId);
    console.log('Search registrations:', filteredRegistrations);
    res.render('searchRegistrations', { registrations: filteredRegistrations, query });
  } catch (err) {
    console.error('Search registrations error:', err);
    res.status(500).send('Server error');
  }
};