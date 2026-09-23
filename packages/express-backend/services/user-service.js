import User from '../models/user.js';

export function findAllUsers() {
  return User.find();
}

export function findUserByName(name) {
  return User.find({ name: name });
}

export function findUserByJob(job) {
  return User.find({ job: job });
}

export function findUserByNameAndJob(name, job) {
  return User.find({
    name: name,
    job: job,
  });
}

export function findUserById(id) {
  return User.findById(id);
}

export function addUser(user) {
  return User.create(user);
}

export function deleteUserById(id) {
  return User.findByIdAndDelete(id);
}