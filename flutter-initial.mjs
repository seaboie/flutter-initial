#!/usr/bin/env node

import { getProjectName } from "./methods/utils.mjs";
import { askQuestions } from "./methods/ask-question.mjs";


await getProjectName(1);
await askQuestions();
