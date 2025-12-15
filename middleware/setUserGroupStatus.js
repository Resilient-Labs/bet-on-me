// this is to set a conditional for the nav, 
// if user is signed in && in a group, 
// they should have access to team page and user goal page from the nav

const Cluster = require("../models/Cluster");

module.exports = async (req, res, next)=> {
    res.locals.isInGroup = false;

    if(!req.user) {
        return next();
    }

    try {
        const cluster = await Cluster.findOne({
            cluster_members: req.user._id
        }).select("_id");

        res.locals.isInGroup = !!cluster;
    } catch (err) {
        console.error("group check failed:" , err);
    }

    next();
}