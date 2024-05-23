import prisma from "@/lib/prisma";
import { authOptions } from "@/lib/auth-options";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";

const breadcrumbItems = [{ title: "Program", link: "/dashboard/program" }];

export default async function page({ params }: { params: { programId: string } }) {
  const session = await getServerSession(authOptions);

  if (!session) redirect("/auth/signin");

  const program = await prisma.program.findUnique({
    where: {
      id: params.programId,
    },
    include: {
      scope: true,
    },
  });

  if (!program) redirect("/dashboard/program");

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold">{program.name}</h1>
      <p><a href={program.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">{program.url}</a></p>
      <div className="mt-4">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Scope
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Type
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {program.scope.map((scope) => (
              <tr key={scope.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{scope.scope}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{scope.scopeType}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
