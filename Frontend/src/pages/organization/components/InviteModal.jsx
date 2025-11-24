import React from "react";
import { FiX } from "react-icons/fi";

export default function InviteModal({
    inviteMode,
    inviteEmail,
    autocomplete,
    savedContacts,
    setInviteEmail,
    handleInviteEmailChange,
    sendInvite,
    removeContact,
    onClose
}) {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
            <div className="bg-white rounded-xl w-full max-w-2xl shadow-lg overflow-hidden">

                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b">
                    <h3 className="font-semibold text-lg">
                        Invite {inviteMode === "teacher" ? "Teacher" : "Student"}
                    </h3>
                    <button onClick={onClose} className="p-2 rounded-md text-gray-600 hover:bg-gray-100">
                        <FiX />
                    </button>
                </div>

                {/* Body */}
                <div className="p-6 space-y-4">

                    {/* Email input */}
                    <label className="block text-sm text-gray-600">Email</label>
                    <div className="relative">
                        <input
                            value={inviteEmail}
                            onChange={(e) => handleInviteEmailChange(e.target.value)}
                            className="w-full p-3 border rounded-lg pr-32"
                            placeholder={`invite@${inviteMode}.com`}
                        />

                        <div className="absolute right-2 top-1/2 -translate-y-1/2 flex gap-2">
                            <button
                                onClick={() => {
                                    if (autocomplete[0]) setInviteEmail(autocomplete[0]);
                                }}
                                className="px-3 py-2 bg-gray-100 rounded"
                            >
                                Use
                            </button>

                            <button
                                onClick={sendInvite}
                                className="px-4 py-2 bg-purple-600 text-white rounded"
                            >
                                Send
                            </button>
                        </div>
                    </div>

                    {/* Autocomplete list */}
                    {autocomplete.length > 0 && (
                        <div className="flex gap-2 flex-wrap">
                            {autocomplete.map((a) => (
                                <button
                                    key={a}
                                    onClick={() => setInviteEmail(a)}
                                    className="px-3 py-1 bg-gray-100 rounded"
                                >
                                    {a}
                                </button>
                            ))}
                        </div>
                    )}

                    {/* Saved Contacts */}
                    <div className="pt-2 border-t">
                        <p className="text-sm text-gray-600">Saved Contacts</p>

                        <div className="max-h-36 overflow-auto mt-2 space-y-2">
                            {savedContacts.map((c) => (
                                <div
                                    key={c}
                                    className="flex items-center justify-between bg-gray-50 p-2 rounded"
                                >
                                    <div className="text-sm">{c}</div>

                                    <div className="flex items-center gap-2">
                                        <button
                                            onClick={() => setInviteEmail(c)}
                                            className="px-2 py-1 bg-white border rounded"
                                        >
                                            Use
                                        </button>

                                        <button
                                            onClick={() => removeContact(c)}
                                            className="px-2 py-1 text-red-500"
                                        >
                                            Remove
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}
