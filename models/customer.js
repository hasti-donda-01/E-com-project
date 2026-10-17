// name:         { type: String, required: function () { return this.role !== "user"; }, default: null },
// password:     { type: String, required: function () { return this.role !== "user"; }, default: null },
// phone:        { type: String, required: function () { return this.role !== "user"; }, unique: true, sparse: true, default: undefined },
// profileImage: { type: String, default: null },
// otpAttempts:  { type: Number, default: 0 },          // add this new field
// profileImageName: { type: String, default: null },   // was default: false