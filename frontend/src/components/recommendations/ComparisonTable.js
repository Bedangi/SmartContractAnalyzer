import ComparisonCell from "./ComparisonCell";
import VerdictCell from "./VerdictCell";

function ComparisonTable({
  companies,
  rows,
  verdicts,
  selectedCompany,
  onCompanySelect,
}) {
  return (
    <div className="overflow-hidden border shadow-sm bg-surface rounded-2xl border-outline-variant">

      <div className="overflow-x-auto">

        <table className="w-full text-left border-collapse">

          {/* Header */}
          <thead>

            <tr className="bg-surface-container-low">

              <th className="w-1/5 p-6 border-b border-outline-variant font-title-md text-on-surface-variant">
                Features
              </th>

              {companies.map((company) => {
                const isSelected = selectedCompany === company.id;

                return (
                    <th
                    key={company.id}
                    onClick={() => onCompanySelect(company.id)}
                    className={`
                        p-6
                        border-b
                        border-outline-variant
                        w-1/4
                        cursor-pointer
                        transition-colors
                        ${
                        isSelected
                            ? "bg-primary/5"
                            : "hover:bg-surface-container"
                        }
                    `}
                    >

                  <div className="flex items-center gap-3">

                    <div
                      className={`
                        w-10
                        h-10
                        rounded-lg
                        flex
                        items-center
                        justify-center
                        font-bold
                        ${
                          company.type === "current"
                            ? "bg-primary-container text-on-primary-container"
                            : "bg-surface-container-highest text-primary"
                        }
                      `}
                    >
                      {company.abbreviation}
                    </div>

                    <div>

                      <div
                        className={`
                          font-title-md
                          ${
                            company.type === "current"
                              ? "text-primary"
                              : ""
                          }
                        `}
                      >
                        {company.name}
                      </div>

                      {company.type === "current" && (
                        <div className="font-label-sm text-outline">
                          CURRENT TARGET
                        </div>
                      )}

                    </div>

                  </div>

                </th>
                );
            })}

            </tr>

          </thead>

          {/* Body */}
          <tbody className="divide-y divide-outline-variant">

            {rows.map((row) => (
              <tr
                key={row.id}
                className="transition-all hover:bg-surface-container-lowest hover:translate-x-1"
              >

                {/* Feature */}
                <td className="p-6 align-top">

                  <div className="font-bold text-on-surface">
                    {row.feature}
                  </div>

                  <div className="text-xs text-outline">
                    {row.description}
                  </div>

                </td>

                {/* Companies */}
                {companies.map((company) => (
                  <ComparisonCell
                    key={company.id}
                    value={row.values[company.id]}
                    selected={selectedCompany === company.id}
                  />
                ))}

              </tr>
            ))}

            {/* Verdict */}
            <tr className="bg-surface-container-low">

              <td className="p-6 align-top">

                <div className="font-bold text-primary">
                  Final Verdict
                </div>

                <div className="text-xs text-outline">
                  AI Synthesis
                </div>

              </td>

              {companies.map((company) => (
                <VerdictCell
                  key={company.id}
                    verdict={verdicts[company.id]}
                    selected={selectedCompany === company.id}
                />
              ))}

            </tr>

          </tbody>

        </table>

      </div>

    </div>
  );
}

export default ComparisonTable;