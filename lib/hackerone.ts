import prisma from "@/lib/prisma";

export default class Hackerone {
  static async severityToCVSS(severity: string) {
    switch (severity) {
      case "critical":
        return 9.0;
      case "high":
        return 7.0;
      case "medium":
        return 4.0;
      case "low":
        return 2.0;
      case "na":
        return 0.0;
      default:
        return 0.0;
    }
  }

  static async verifyLogin(username: string, apiKey: string) {
    const login = await fetch(
      "https://api.hackerone.com/v1/hackers/me/reports",
      {
        headers: {
          Authorization: `Basic ${btoa(username + ":" + apiKey)}`,
        },
      },
    );

    if (login.status === 200) {
      return true;
    } else {
      return false;
    }
  }

  static async reloadPrograms(userId: string, platformId: string) {
    const platform = await prisma.platform.findFirst({
      where: {
        id: platformId,
      },
    });

    let page = 1;
    let hasNext = true;

    while (hasNext) {
      const programsReq = await fetch(
        `https://api.hackerone.com/v1/hackers/programs?page[number]=${page}`,
        {
          method: "GET",
          headers: {
            Authorization: `Basic ${btoa(
              platform.email + ":" + platform.password,
            )}`,
          },
        },
      );
      const programsResp = await programsReq.json();
      if (!programsResp.links.next) {
        hasNext = false;
      } else {
        programsResp.data.forEach(async (program: any) => {
          const existingProgram = await prisma.program.findFirst({
            where: {
              userId: userId,
              slug: program.attributes.handle,
            },
          });

          if (!existingProgram) {
            await prisma.program.create({
              data: {
                userId: userId,
                platformId: platformId,
                name: program.attributes.name,
                slug: program.attributes.handle,
                url: `https://hackerone.com/${program.attributes.handle}`,
                vdp: !program.attributes.offers_bounties,
                type:
                  program.attributes.state === "public_mode"
                    ? "public"
                    : "private",
                bountyMin: 0,
                bountyMax: 0,
              },
            });
          } else {
            await prisma.program.update({
              where: {
                id: existingProgram.id,
              },
              data: {
                name: program.attributes.name,
                url: `https://hackerone.com/${program.attributes.handle}`,
                vdp: !program.attributes.offers_bounties,
                type:
                  program.attributes.state === "public_mode"
                    ? "public"
                    : "private",
                bountyMin: 0,
                bountyMax: 0,
              },
            });
          }
        });
        page++;
      }
    }
  }

  static async reloadReports(userId: string, platformId: string) {
    const platform = await prisma.platform.findFirst({
      where: {
        id: platformId,
      },
    });

    let page = 1;
    let hasNext = true;

    while (hasNext) {
      const reportsReq = await fetch(
        `https://api.hackerone.com/v1/hackers/me/reports?page[number]=${page}`,
        {
          method: "GET",
          headers: {
            Authorization: `Basic ${btoa(
              platform.email + ":" + platform.password,
            )}`,
          },
        },
      );
      const reportsResp = await reportsReq.json();
      if (!reportsResp.links.next) {
        hasNext = false;
      } else {
        reportsResp.data.forEach(async (report: any) => {
          const existingReport = await prisma.report.findFirst({
            where: {
              userId: userId,
              reportId: report.id,
            },
          });
          let bounty = null;

          if (report.attributes.bounty_awarded_at !== null) {
            console.log("BOUNTYYYY")
            console.log(report.id)
            bounty = 0.0;
            let bountyReq = await fetch(
              `https://api.hackerone.com/v1/hackers/reports/${report.id}`,
              {
                method: "GET",
                headers: {
                  Authorization: `Basic ${btoa(
                    platform.email + ":" + platform.password,
                  )}`,
                },
              },
            );
            let bountyResp = await bountyReq.json();
            bountyResp.data.relationships.bounties.data.forEach(
              (bounty: any) => {
                bounty += bounty.attributes.awarded_amount;
              },
            );
          }

          if (!existingReport) {
            let program = await prisma.program.findFirst({
              where: {
                userId: userId,
                slug: report.relationships.program.data.attributes.handle,
              },
            });

            if (program) {
              await prisma.report.create({
                data: {
                  userId: userId,
                  platformId: platformId,
                  programId: program.id,
                  title: report.attributes.title,
                  reportId: report.id,
                  bounty: bounty,
                  currency: "USD",
                  collab: false,
                  status: report.attributes.state,
                  cvssVector: report.relationships.severity.data.attributes
                    .cvss_vector_string
                    ? report.relationships.severity.data.attributes
                        .cvss_vector_string
                    : null,
                  cvss: report.relationships.severity.data.attributes.score
                    ? report.relationships.severity.data.attributes.score
                    : null,
                  createdDate: report.attributes.created_at,
                  updatedDate: report.attributes.last_public_activity_at,
                },
              });
            }
          } else {
            await prisma.report.update({
              where: {
                id: existingReport.id,
              },
              data: {
                title: report.attributes.title,
                reportId: report.id,
                bounty: bounty,
                currency: "USD",
                collab: false,
                status: report.attributes.state,
                cvssVector: report.relationships.severity.data.attributes
                  .cvss_vector_string
                  ? report.relationships.severity.data.attributes
                      .cvss_vector_string
                  : null,
                cvss: report.relationships.severity.data.attributes.score
                  ? report.relationships.severity.data.attributes.score
                  : null,
                createdDate: report.attributes.created_at,
                updatedDate: report.attributes.last_public_activity_at,
              },
            });
          }
        });
        page++;
      }
    }
  }
}
