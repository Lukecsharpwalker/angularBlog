/**
 * Prerender Parameters Generator
 * 
 * Fetches published post IDs from Supabase for Angular SSR prerendering.
 * Used by app.routes.server.ts to generate static routes.
 */

export async function getPrerenderParams(): Promise<{ id: string }[]> {
  try {
    const supabaseUrl = 'https://aqdbdmepncxxuanlymwr.supabase.co';
    const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFxZGJkbWVwbmN4eHVhbmx5bXdyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDUwNTA0MjYsImV4cCI6MjA2MDYyNjQyNn0.RNtZZ4Of4LIP3XuS9lumHYdjRLVUGXARtAxaTJmF7lc';
    
    const response = await fetch(`${supabaseUrl}/rest/v1/posts?select=id&is_draft=eq.false&order=created_at.desc`, {
      headers: {
        'apikey': supabaseKey,
        'Authorization': `Bearer ${supabaseKey}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      console.error('Failed to fetch posts for prerendering:', response.statusText);
      return [];
    }

    const posts = await response.json();
    return posts.map((post: { id: string }) => ({ id: post.id }));
  } catch (error) {
    console.error('Error fetching posts for prerendering:', error);
    return [];
  }
}