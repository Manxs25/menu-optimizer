const Dish = require("../models/Dish");
const Groq = require("groq-sdk");

function normalizeHeader(value = "") {
  return String(value)
    .trim()
    .toLowerCase()
    .replace(/\s+/g, " ")
    .replace(/[^a-z0-9/ -]/g, "");
}

function parseMarkdownTableReport(text) {
  const lines = text
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line.startsWith("|") && line.endsWith("|"));

  const rows = lines.map((line) =>
    line
      .slice(1, -1)
      .split("|")
      .map((cell) => cell.trim())
  );

  const headerIndex = rows.findIndex((row) => {
    const headers = row.map(normalizeHeader);
    return headers.includes("dish") && headers.includes("rate") && headers.includes("ala-carte qty");
  });

  if (headerIndex === -1) return null;

  const headers = rows[headerIndex].map(normalizeHeader);
  const indexOf = (...names) => headers.findIndex((header) => names.includes(header));

  const indexes = {
    name: indexOf("dish"),
    price: indexOf("rate"),
    cost: indexOf("l/p", "lp"),
    orders: indexOf("ala-carte qty", "alacarte qty"),
  };

  return rows
    .slice(headerIndex + 1)
    .map((row) => ({
      name: row[indexes.name],
      price: row[indexes.price],
      cost: row[indexes.cost],
      orders: row[indexes.orders],
    }))
    .filter((row) => row.name || row.price || row.cost || row.orders);
}

function parseUploadedRows(text) {
  const markdownRows = parseMarkdownTableReport(text);
  if (markdownRows) return { rows: markdownRows, errors: [] };

  const Papa = require("papaparse");
  const { data, errors } = Papa.parse(text, {
    header: true,
    skipEmptyLines: true,
    dynamicTyping: true,
  });

  return { rows: data, errors };
}

function toNumber(value) {
  if (value === undefined || value === null || value === "") return NaN;
  return Number(String(value).replace(/,/g, "").trim());
}

// ─── Helpers ──────────────────────────────────────────────────────────────────
function categorizeDish(dish, avgProfit, avgOrders) {
  const unitProfit = dish.price - dish.cost;
  const highProfit = unitProfit >= avgProfit;
  const highDemand = dish.orders >= avgOrders;

  if (highDemand && highProfit)
    return { category: "Star", emoji: "⭐", priority: "good", why: "High demand and strong profit margin — your best performer.", suggestion: "Promote as bestseller. Feature on menu & social media." };
  if (highDemand && !highProfit)
    return { category: "Plowhorse", emoji: "🐄", priority: "medium", why: "Popular with customers but profit margin is thin.", suggestion: "Reduce cost by 10–15% or increase price by 8–12%." };
  if (!highDemand && highProfit)
    return { category: "Puzzle", emoji: "🧩", priority: "medium", why: "Great margin but low customer demand.", suggestion: "Run promotions or add to combo deals to boost orders." };
  return { category: "Dog", emoji: "🐶", priority: "high", why: "Low demand and low profitability — dragging down your menu.", suggestion: "Consider removing or completely reworking this item." };
}

// ─── GET /api/menu ─────────────────────────────────────────────────────────────
exports.getMenu = async (req, res) => {
  try {
    const dishes = await Dish.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.status(200).json(dishes);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ─── POST /api/menu/add ────────────────────────────────────────────────────────
exports.addDish = async (req, res) => {
  try {
    const { name, price, cost, orders } = req.body;
    if (!name || !price || !cost) {
      return res.status(400).json({ error: "Name, price and cost are required." });
    }
    const newDish = new Dish({ user: req.user.id, name, price, cost, orders: orders || 0 });
    const savedDish = await newDish.save();
    res.status(201).json(savedDish);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// ─── PUT /api/menu/:id ─────────────────────────────────────────────────────────
exports.updateDish = async (req, res) => {
  try {
    const { name, price, cost, orders } = req.body;
    const updated = await Dish.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      { name, price, cost, orders },
      { new: true, runValidators: true }
    );
    if (!updated) return res.status(404).json({ error: "Dish not found." });
    res.status(200).json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// ─── DELETE /api/menu/:id ──────────────────────────────────────────────────────
exports.deleteDish = async (req, res) => {
  try {
    const deleted = await Dish.findOneAndDelete({ _id: req.params.id, user: req.user.id });
    if (!deleted) return res.status(404).json({ error: "Dish not found." });
    res.status(200).json({ message: "Dish deleted successfully.", id: req.params.id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ─── GET /api/menu/stats ───────────────────────────────────────────────────────
exports.getStats = async (req, res) => {
  try {
    const dishes = await Dish.find({ user: req.user.id });
    if (dishes.length === 0) {
      return res.status(200).json({ health: 0, totalItems: 0, margin: 0, totalProfit: 0, avgProfit: 0, stars: 0, dogs: 0, puzzles: 0, plowhorses: 0 });
    }
    const totalProfit = dishes.reduce((acc, d) => acc + (d.price - d.cost) * d.orders, 0);
    const avgProfit = Math.round(dishes.reduce((acc, d) => acc + (d.price - d.cost), 0) / dishes.length);
    const avgOrders = dishes.reduce((acc, d) => acc + d.orders, 0) / dishes.length;
    const avgMargin = Math.round(dishes.reduce((acc, d) => acc + ((d.price - d.cost) / d.price) * 100, 0) / dishes.length);
    const counts = { Star: 0, Plowhorse: 0, Puzzle: 0, Dog: 0 };
    dishes.forEach((d) => { const meta = categorizeDish(d, avgProfit, avgOrders); counts[meta.category]++; });
    const health = Math.round(((dishes.length - counts.Dog) / dishes.length) * 100);
    res.status(200).json({ health, totalItems: dishes.length, margin: avgMargin, totalProfit, avgProfit, stars: counts.Star, dogs: counts.Dog, puzzles: counts.Puzzle, plowhorses: counts.Plowhorse });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ─── GET /api/menu/analysis ────────────────────────────────────────────────────
exports.getMenuAnalysis = async (req, res) => {
  try {
    const dishes = await Dish.find({ user: req.user.id });
    if (dishes.length === 0) {
      return res.status(200).json({ message: "No dishes to analyze yet!" });
    }
    const avgProfit = dishes.reduce((acc, d) => acc + (d.price - d.cost), 0) / dishes.length;
    const avgOrders = dishes.reduce((acc, d) => acc + d.orders, 0) / dishes.length;
    const analyzedMenu = dishes.map((dish) => {
      const unitProfit = dish.price - dish.cost;
      const margin = Math.round((unitProfit / dish.price) * 100);
      const totalProfit = unitProfit * dish.orders;
      const meta = categorizeDish(dish, avgProfit, avgOrders);
      return { ...dish._doc, unitProfit, margin, totalProfit, ...meta };
    });
    res.status(200).json({ benchmarks: { avgProfit, avgOrders }, results: analyzedMenu });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ─── POST /api/menu/optimize ───────────────────────────────────────────────────
exports.optimizeMenu = async (req, res) => {
  try {
    console.log("Token received:", req.headers['x-auth-token']);
    console.log("User:", req.user);

    const dishes = await Dish.find({ user: req.user.id });
    if (!dishes.length) {
      return res.status(400).json({ error: "No dishes found to optimize." });
    }

    const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

    const avgProfit = dishes.reduce((acc, d) => acc + (d.price - d.cost), 0) / dishes.length;
    const avgOrders = dishes.reduce((acc, d) => acc + d.orders, 0) / dishes.length;

    const dishSummary = dishes.map((d) => ({
      name: d.name,
      sellingPrice: d.price,
      costPrice: d.cost,
      monthlyOrders: d.orders,
      unitProfit: d.price - d.cost,
      monthlyRevenue: (d.price - d.cost) * d.orders,
      category: categorizeDish(d, avgProfit, avgOrders).category,
    }));

    const prompt = `You are a restaurant menu optimization expert. Analyze these dishes and return a JSON array of recommendations.

Dishes data:
${JSON.stringify(dishSummary, null, 2)}

Average unit profit: ₹${Math.round(avgProfit)}
Average monthly orders: ${Math.round(avgOrders)}

For each dish give a specific, actionable recommendation based on its category:
- Star (high profit + high orders): how to maximize further
- Plowhorse (low profit + high orders): how to improve margins
- Puzzle (high profit + low orders): how to boost demand
- Dog (low profit + low orders): whether to remove or rework

Return ONLY a valid JSON array, no extra text, no markdown:
[
  {
    "name": "dish name",
    "category": "Star/Plowhorse/Puzzle/Dog",
    "action": "short action title e.g. Raise Price",
    "reason": "one sentence explanation",
    "impact": "e.g. +₹4,000/month estimated",
    "priority": "high/medium/low"
  }
]`;

    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7,
      max_tokens: 2000,
    });

    const text = completion.choices[0]?.message?.content || "";
    const cleaned = text.replace(/```json|```/g, "").trim();
    const recommendations = JSON.parse(cleaned);

    res.status(200).json({ success: true, recommendations });
  } catch (err) {
    console.error("Optimize error:", err);
    res.status(500).json({ error: err.message });
  }
};
// ─── POST /api/menu/bulk-upload ────────────────────────────────────────────────
exports.bulkUpload = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: "No file uploaded." });

    const fileText = req.file.buffer.toString("utf8");
    const { rows, errors } = parseUploadedRows(fileText);

    if (errors.length > 0) {
      return res.status(400).json({ error: "File parsing failed.", details: errors });
    }

    // Validate and map rows
    const dishes = [];
    const failed = [];

    for (const row of rows) {
      const name = row.name || row.Name;
      const price = toNumber(row.price || row.Price);
      const cost = toNumber(row.cost || row.Cost);
      const orders = toNumber(row.orders || row.Orders || 0);

      if (!name || !price || !cost || price <= 0 || cost <= 0 || cost >= price) {
        failed.push({ row, reason: "Missing or invalid fields" });
        continue;
      }

      dishes.push({ user: req.user.id, name, price, cost, orders });
    }

    if (dishes.length === 0) {
      return res.status(400).json({ error: "No valid dishes found in CSV.", failed });
    }

    await Dish.insertMany(dishes);

    res.status(200).json({
      success: true,
      inserted: dishes.length,
      skipped: failed.length,
      failed,
    });

  } catch (err) {
    console.error("Bulk upload error:", err);
    res.status(500).json({ error: err.message });
  }
};
