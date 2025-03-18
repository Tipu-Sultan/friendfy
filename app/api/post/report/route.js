import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import dbConnect from "@/lib/db";
import Reports from "@/models/PostReport";

export async function POST(req) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();

    const { postId, reason, details } = await req.json();

    if (!postId || !reason) {
      return NextResponse.json(
        { error: "Post ID and reason are required" },
        { status: 400 }
      );
    }

    // Check if the user has already reported this post
    const existingReport = await Reports.findOne({
      postId,
      reportedBy: session.user.id,
    });

    if (existingReport) {
      if (existingReport.reason === reason) {
        // If the reason is the same, do not insert or update
        return NextResponse.json(
          { message: "You have already reported this post for the same reason." },
          { status: 200 }
        );
      } else {
        // If the reason is different, update the existing report
        existingReport.reason = reason;
        existingReport.details = details;
        await existingReport.save();

        return NextResponse.json({
          message: "Your report reason has been updated.",
          report: existingReport,
        });
      }
    }

    // If no existing report, create a new one
    const newReport = await Reports.create({
      postId,
      reportedBy: session.user.id,
      reason,
      details,
    });

    return NextResponse.json({
      message: "Report submitted successfully",
      report: {
        _id: newReport._id,
        postId: newReport.postId,
        reason: newReport.reason,
        details: newReport.details,
        createdAt: newReport.createdAt,
      },
    });
  } catch (error) {
    console.error("Error reporting post:", error.message);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
