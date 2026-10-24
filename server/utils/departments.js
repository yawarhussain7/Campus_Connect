
import axios from "axios";
import * as cheerio from "cheerio";

export const scarppingDepartments = async (url) => {
  try {
    const response = await axios.get(url, {
      timeout: 20000,
      headers: {
        "User-Agent": "Mozilla/5.0",
      },
    });

    const $ = cheerio.load(response.data);
    const departments = [];

    $("select").each((_, element) => {
      const select = $(element);

      const identifier = [
        select.attr("id"),
        select.attr("name"),
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      const options = select.find("option").toArray();

      const looksLikeDepartments =
        identifier.includes("department") ||
        identifier.includes("dept");

      // Optional case: inspect ddlClasses as well.
      const looksLikeClasses =
        identifier.includes("ddlclasses");

      if (looksLikeDepartments || looksLikeClasses) {
        options.forEach((option) => {
          const name = $(option).text().trim();
          const rawCode = $(option).attr("value");
          const code = rawCode?.trim() || name;

          // Handle optional or placeholder options.
          if (
            !name ||
            !code ||
            $(option).is(":disabled") ||
            /^(select|choose|please select)/i.test(name) ||
            /^(0|null|undefined)$/i.test(code)
          ) {
            return;
          }

          departments.push({ name, code });
        });
      }
    });

    // Remove duplicate codes.
    return [
      ...new Map(
        departments.map((department) => [
          department.code.toLowerCase(),
          department,
        ])
      ).values(),
    ];
  } catch (error) {
    throw new Error(
      `Failed to scrape departments: ${error.message}`
    );
  }
};
