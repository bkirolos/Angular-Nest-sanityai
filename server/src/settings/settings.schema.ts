import * as mongoose from 'mongoose';
import { Settings } from './settings.interface';

export const settingsSchema = new mongoose.Schema({
	name: { type:String, index:true, unique:true },
	value: String,

	__v: { type: Number, select: false },

	createDate: Date,
	updateDate: Date,
});

export interface SettingsDocument extends Settings, mongoose.Document {}

export { Settings };
