"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import AdminNavigation from "@/components/component/Admin/Navigation/AdminNav";
import { Button } from "@/components/ui/button";

interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
  createdAt: string;
  updatedAt: string;
  createdDate: string;
}

export default function SettingsPage() {
  const { data: session } = useSession();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<string | null>(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetch("/api/admin/users");
        if (res.ok) {
          const data = await res.json();
          setUsers(data);
        }
      } catch (error) {
        console.error("Failed to fetch users", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const updateUserRole = async (userId: string, newRole: string) => {
    setUpdating(userId);
    try {
      // Validate session before performing critical action
      const sessionCheck = await fetch("/api/validate-session");
      if (!sessionCheck.ok) {
        alert("Your session has expired. Please sign in again.");
        window.location.href = "/admin/signin";
        return;
      }

      const res = await fetch("/api/admin/users", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, role: newRole }),
      });

      if (res.ok) {
        setUsers(
          users.map((user) =>
            user._id === userId ? { ...user, role: newRole } : user
          )
        );
      }
    } catch (error) {
      console.error("Failed to update user role", error);
    } finally {
      setUpdating(null);
    }
  };

  const deleteUser = async (userId: string) => {
    if (!window.confirm("Are you sure you want to delete this user?")) {
      return;
    }

    setUpdating(userId);
    try {
      // Validate session before performing critical action
      const sessionCheck = await fetch("/api/validate-session");
      if (!sessionCheck.ok) {
        alert("Your session has expired. Please sign in again.");
        window.location.href = "/admin/signin";
        return;
      }

      const res = await fetch("/api/admin/users", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId }),
      });

      if (res.ok) {
        setUsers(users.filter((user) => user._id !== userId));
      }
    } catch (error) {
      console.error("Failed to delete user", error);
    } finally {
      setUpdating(null);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen bg-gray-100">
        <AdminNavigation />
        <div className="flex-1 flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-100">
      <AdminNavigation />
      <div className="flex-1">
        {/* Top header */}
        <header className="bg-white shadow-sm border-b px-6 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
          </div>
        </header>

        <main className="p-8">
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">
                User Management
              </h2>
              <p className="text-sm text-gray-600">
                Manage user accounts and permissions
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      User
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Role
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Joined
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {users.map((user) => (
                    <tr key={user._id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {user.name}
                          </div>
                          <div className="text-sm text-gray-500">
                            {user.email}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            user.role === "admin"
                              ? "bg-purple-100 text-purple-800"
                              : "bg-green-100 text-green-800"
                          }`}
                        >
                          {user.role}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(
                          user.createdDate || user.createdAt
                        ).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm space-x-2">
                        {user._id !== session?.user?.id && (
                          <>
                            {user.role === "admin" ? (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => updateUserRole(user._id, "user")}
                                disabled={updating === user._id}
                                className="text-orange-600 hover:text-orange-700"
                              >
                                {updating === user._id
                                  ? "Updating..."
                                  : "Remove Admin"}
                              </Button>
                            ) : (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() =>
                                  updateUserRole(user._id, "admin")
                                }
                                disabled={updating === user._id}
                                className="text-blue-600 hover:text-blue-700"
                              >
                                {updating === user._id
                                  ? "Updating..."
                                  : "Make Admin"}
                              </Button>
                            )}
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => deleteUser(user._id)}
                              disabled={updating === user._id}
                              className="text-red-600 hover:text-red-700"
                            >
                              {updating === user._id ? "Deleting..." : "Delete"}
                            </Button>
                          </>
                        )}
                        {user._id === session?.user?.id && (
                          <span className="text-sm text-gray-500 italic">
                            Current User
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {users.length === 0 && (
              <div className="text-center py-8">
                <p className="text-gray-500">No users found.</p>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
