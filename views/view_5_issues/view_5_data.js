import { supabase } from '../../js/supabaseClient.js';

export async function insertIssue(issueObj) {
    const { data, error } = await supabase
        .from('facility_issues')
        .insert([{
            issue_title: issueObj.issue,
            tool_required_text: issueObj.tool_required,
            initiated_by_text: issueObj.initiated_by,
            notes: issueObj.notes,
            related_facility_name: issueObj.related_facility_name || '',
            related_project_title: issueObj.related_project_title || '',

            related_facility: issueObj.related_facility,
            related_project: issueObj.related_project || null,
            reported_by: issueObj.reported_by || null,
            open_issue: true
        }])
        .select();

    if (error) console.error("Facility issue insert error:", error);
    return data && data[0] ? data[0] : null;
}
