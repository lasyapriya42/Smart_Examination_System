import express from "express";
import multer from "multer";
import csv from "csv-parser";
import fs from "fs";
import path from "path";
import xlsx from "xlsx";
import Student from "../models/Student.js";

const router = express.Router();

const upload = multer({
  dest: "uploads/",
  limits: { fileSize: 2 * 1024 * 1024 }, // 2MB max
});

const normalizeHeader = (value) =>
  String(value || "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "");

const FIELD_ALIASES = {
  rollNo: [
    "rollno",
    "rollnumber",
    "rollregregistrationnumber",
    "registerno",
    "registernumber",
    "registrationno",
    "registrationnumber",
    "regno",
    "regnumber",
    "register",
    "admissionno",
    "admissionnumber",
    "enrollmentno",
    "enrollmentnumber",
    "enrolmentno",
    "enrolmentnumber",
    "universityno",
    "universitynumber",
    "studentid",
  ],
  name: ["name", "studentname", "fullname"],
  email: ["email", "mail", "emailid", "emailaddress", "studentemail", "mailid"],
  section: ["section", "sec"],
  year: [
    "year",
    "studyyear",
    "academicyear",
    "yearofstudy",
    "currentyear",
    "studyingyear",
    "years",
  ],
  semester: [
    "semester",
    "sem",
    "term",
    "semster",
    "semesterno",
    "semesternumber",
    "semno",
    "currentsemester",
  ],
  department: ["department", "dept", "branch"],
};

const DEFAULT_SEMESTER = 6;
const DEFAULT_SECTION = "NA";
const REQUIRED_FIELDS = ["name", "rollNo", "email", "year"];

const fieldTokenMatchers = {
  rollNo: (header) => {
    const h = normalizeHeader(header);
    return (
      h.includes("roll") ||
      h.includes("register") ||
      h.includes("reg") ||
      h.includes("registration") ||
      h.includes("admission") ||
      h.includes("enrollment") ||
      h.includes("enrolment") ||
      h.includes("studentid")
    );
  },
  name: (header) => {
    const h = normalizeHeader(header);
    return h.includes("name");
  },
  email: (header) => {
    const h = normalizeHeader(header);
    return h.includes("email") || h === "mail" || h.includes("mailid");
  },
  section: (header) => {
    const h = normalizeHeader(header);
    return h === "section" || h === "sec" || h.includes("section");
  },
  year: (header) => {
    const h = normalizeHeader(header);
    return h === "year" || h === "yr" || h.includes("year");
  },
  semester: (header) => {
    const h = normalizeHeader(header);
    return h.includes("semester") || h === "sem" || h.includes("sem");
  },
  department: (header) => {
    const h = normalizeHeader(header);
    return h.includes("department") || h === "dept" || h.includes("branch");
  },
};

const headerMatchesField = (header, field) => {
  const normalized = normalizeHeader(header);
  const aliases = FIELD_ALIASES[field] || [];
  if (aliases.includes(normalized)) {
    return true;
  }
  const matcher = fieldTokenMatchers[field];
  return typeof matcher === "function" ? matcher(header) : false;
};

const getFieldValue = (row, field) => {
  for (const [rawKey, rawValue] of Object.entries(row || {})) {
    if (headerMatchesField(rawKey, field)) {
      const value = String(rawValue || "").trim();
      if (value !== "") {
        return value;
      }
    }
  }
  return "";
};

const findMissingColumns = (rows) => {
  const presentHeaders = new Set();

  rows.forEach((row) => {
    Object.keys(row || {}).forEach((key) => {
      presentHeaders.add(normalizeHeader(key));
    });
  });

  return REQUIRED_FIELDS.filter((field) => {
    const aliases = FIELD_ALIASES[field] || [];
    const exactMatch = aliases.some((alias) => presentHeaders.has(alias));
    if (exactMatch) {
      return false;
    }
    return !Array.from(presentHeaders).some((header) => headerMatchesField(header, field));
  });
};

const getDetectedHeaders = (rows) => {
  const detected = new Set();
  rows.forEach((row) => {
    Object.keys(row || {}).forEach((key) => {
      const normalized = normalizeHeader(key);
      if (normalized) {
        detected.add(normalized);
      }
    });
  });
  return Array.from(detected);
};

const toPositiveNumber = (value) => {
  const num = Number(value);
  if (Number.isNaN(num) || num <= 0) {
    return null;
  }
  return num;
};

const formatMissingColumns = (missingFields) => {
  const labels = {
    name: "name",
    rollNo: "roll/reg/registration number",
    email: "email",
    section: "section",
    year: "year",
    semester: "semester",
    department: "department",
  };
  return missingFields.map((field) => labels[field] || field);
};

const cleanValue = (value) => String(value || "").trim();

const normalizeText = (value) =>
  String(value || "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "");

const DEPARTMENT_CANONICAL_MAP = {
  cse: "CSE",
  computerscience: "CSE",
  computerscienceengineering: "CSE",
  it: "IT",
  informationtechnology: "IT",
  aiml: "AIML",
  artificialintelligencemachinelearning: "AIML",
  aids: "AIDS",
  artificialintelligencedatascience: "AIDS",
  ece: "ECE",
  electronicscommunicationengineering: "ECE",
  eee: "EEE",
  electricalelectronicsengineering: "EEE",
  ce: "CE",
  civil: "CE",
  civilengineering: "CE",
  me: "ME",
  mechanical: "ME",
  mechanicalengineering: "ME",
  cybersecurity: "CYBERSECURITY",
  cybersecurityengineering: "CYBERSECURITY",
};

const canonicalDepartment = (value) => {
  const clean = cleanValue(value);
  if (!clean) return "";

  const mapped = DEPARTMENT_CANONICAL_MAP[normalizeText(clean)];
  if (mapped) return mapped;

  return clean.toUpperCase();
};

const canonicalSection = (value) => {
  const clean = cleanValue(value);
  if (!clean) return "";

  const normalized = normalizeText(clean);
  if (/^[a-z]$/i.test(clean)) return clean.toUpperCase();
  if (/^[0-9]+$/.test(clean)) return clean;
  if (normalized === "na" || normalized === "nosection") return DEFAULT_SECTION;

  return clean.toUpperCase();
};

const isStandaloneSectionValue = (value) => {
  const clean = cleanValue(value);
  if (!clean) return false;
  return /^[a-z]$/i.test(clean) || /^[0-9]+$/.test(clean);
};

const parseCombinedDepartmentSection = (rawValue) => {
  const value = cleanValue(rawValue);
  if (!value) {
    return { department: "", section: "" };
  }

  if (isStandaloneSectionValue(value)) {
    return { department: "", section: canonicalSection(value) };
  }

  // Handles formats like CSE-A, CSE - B, CSE/A
  const split = value
    .split(/[-/|]/)
    .map((part) => part.trim())
    .filter(Boolean);

  if (split.length >= 2) {
    const department = canonicalDepartment(split[0]);
    const section = canonicalSection(split[1]);
    return { department, section };
  }

  // Branch only values (e.g., Civil) are treated as department.
  return { department: canonicalDepartment(value), section: "" };
};

const parseStudentRow = (row) => {
  const semesterFromFile = toPositiveNumber(getFieldValue(row, "semester"));
  const rawSectionField = getFieldValue(row, "section");
  const rawDepartmentField = getFieldValue(row, "department");
  const fromCombined = parseCombinedDepartmentSection(rawSectionField);

  const department =
    canonicalDepartment(rawDepartmentField) || canonicalDepartment(fromCombined.department);

  const directSection =
    !fromCombined.section && isStandaloneSectionValue(rawSectionField)
      ? canonicalSection(rawSectionField)
      : "";

  const section =
    canonicalSection(fromCombined.section) ||
    directSection ||
    (canonicalDepartment(rawSectionField) ? DEFAULT_SECTION : "") ||
    DEFAULT_SECTION;

  const student = {
    rollNo: getFieldValue(row, "rollNo"),
    name: getFieldValue(row, "name"),
    department,
    year: toPositiveNumber(getFieldValue(row, "year")),
    semester: semesterFromFile || DEFAULT_SEMESTER,
    section,
    email: getFieldValue(row, "email"),
  };

  const missing = [
    !student.rollNo && "rollNo",
    !student.name && "name",
    !student.department && "department",
    !student.email && "email",
    !student.year && "year",
  ].filter(Boolean);

  return { student, missing };
};

const hasAtLeastOneNonEmptyRow = (rows) =>
  rows.some((row) =>
    Object.values(row || {}).some((value) => String(value || "").trim() !== "")
  );

const parseCsvRows = (filePath) =>
  new Promise((resolve, reject) => {
    const rows = [];
    fs.createReadStream(filePath)
      .pipe(csv())
      .on("data", (data) => rows.push(data))
      .on("end", () => resolve(rows))
      .on("error", (err) => reject(err));
  });

const buildRowsFromMatrix = (matrix, headerIndex) => {
  const headers = (matrix[headerIndex] || []).map((h) => String(h || "").trim());
  const rows = [];

  for (let i = headerIndex + 1; i < matrix.length; i += 1) {
    const rowArray = matrix[i] || [];
    const obj = {};
    headers.forEach((header, colIdx) => {
      if (!header) return;
      obj[header] = rowArray[colIdx] ?? "";
    });

    const hasAnyValue = Object.values(obj).some(
      (value) => String(value || "").trim() !== ""
    );

    if (hasAnyValue) {
      rows.push(obj);
    }
  }

  return rows;
};

const scoreHeaderRow = (candidateHeaders) => {
  const normalized = new Set(candidateHeaders.map((h) => normalizeHeader(h)).filter(Boolean));
  return REQUIRED_FIELDS.reduce((score, field) => {
    const aliases = FIELD_ALIASES[field] || [];
    return score + (aliases.some((alias) => normalized.has(alias)) ? 1 : 0);
  }, 0);
};

const parseExcelRows = (filePath) => {
  const workbook = xlsx.readFile(filePath);
  const firstSheetName = workbook.SheetNames[0];
  if (!firstSheetName) {
    return [];
  }

  const sheet = workbook.Sheets[firstSheetName];
  const matrix = xlsx.utils.sheet_to_json(sheet, {
    header: 1,
    defval: "",
    blankrows: false,
  });

  if (!Array.isArray(matrix) || matrix.length === 0) {
    return [];
  }

  let bestHeaderIndex = 0;
  let bestScore = -1;
  const scanLimit = Math.min(matrix.length, 10);

  for (let i = 0; i < scanLimit; i += 1) {
    const row = Array.isArray(matrix[i]) ? matrix[i] : [];
    const score = scoreHeaderRow(row);
    if (score > bestScore) {
      bestScore = score;
      bestHeaderIndex = i;
    }
  }

  return buildRowsFromMatrix(matrix, bestHeaderIndex);
};

// Upload Route
router.post("/students", upload.single("file"), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "Please choose a CSV or Excel file" });
  }

  try {
    const ext = path.extname(req.file.originalname || "").toLowerCase();

    let rows = [];
    if (ext === ".csv") {
      rows = await parseCsvRows(req.file.path);
    } else if (ext === ".xlsx" || ext === ".xls") {
      rows = parseExcelRows(req.file.path);
    } else if (ext === ".pdf") {
      return res.status(400).json({
        message: "PDF is visible for selection, but bulk student upload supports only CSV or Excel files",
      });
    } else {
      return res.status(400).json({
        message: "Unsupported file type. Use .csv, .xlsx, or .xls",
      });
    }

    if (!rows.length || !hasAtLeastOneNonEmptyRow(rows)) {
      return res.status(400).json({
        message: "File is empty or has no student rows",
      });
    }

    const missingColumns = findMissingColumns(rows);
    if (missingColumns.length > 0) {
      return res.status(400).json({
        message: "Missing required columns in file",
        missingColumns: formatMissingColumns(missingColumns),
        detectedHeaders: getDetectedHeaders(rows),
      });
    }

    const docs = [];
    const invalidRows = [];

    rows.forEach((row, index) => {
      const { student, missing } = parseStudentRow(row);

      if (missing.length > 0) {
        invalidRows.push({ row: index + 2, missingFields: missing });
        return;
      }

      docs.push(student);
    });

    if (docs.length === 0) {
      const missingSummary = invalidRows.reduce((acc, item) => {
        (item.missingFields || []).forEach((field) => {
          acc[field] = (acc[field] || 0) + 1;
        });
        return acc;
      }, {});

      const topMissing = Object.entries(missingSummary)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 4)
        .map(([field]) => field);

      return res.status(400).json({
        message: "No valid student rows found. Check column names and required values",
        invalidRows,
        commonMissingFields: topMissing,
      });
    }

    let insertedCount = 0;
    try {
      const inserted = await Student.insertMany(docs, { ordered: false });
      insertedCount = inserted.length;
    } catch (error) {
      if (Array.isArray(error?.writeErrors)) {
        insertedCount = (error.result?.result?.nInserted ?? error.insertedDocs?.length ?? 0);
      } else {
        throw error;
      }
    }

    return res.json({
      message: "Students upload processed",
      count: insertedCount,
      skipped: docs.length - insertedCount,
      invalidRows,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Upload failed" });
  } finally {
    if (req.file?.path && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
  }
});

export default router;