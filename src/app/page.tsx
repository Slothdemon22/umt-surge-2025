import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default async function Home() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // If user is logged in, redirect to dashboard
  if (user) {
    redirect('/dashboard');
  }

  return (
    <div className="flex min-h-screen items-center justify-center">
      <main className="w-full max-w-6xl px-8 py-16">
        <div className="text-center space-y-12">
          {/* Hero Header */}
          <div className="space-y-6">
            <h1 className="text-6xl md:text-7xl font-bold tracking-tight" style={{
              background: 'linear-gradient(135deg, var(--gradient-start), var(--gradient-end))',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}>
              CampusConnect
            </h1>
            <p className="text-2xl md:text-3xl font-semibold" style={{ color: 'var(--foreground)' }}>
              Connect. Collaborate. Create.
            </p>
            <p className="text-lg md:text-xl max-w-2xl mx-auto" style={{ color: 'var(--foreground-muted)' }}>
              The ultimate platform for university students to discover talent, 
              find opportunities, and collaborate on amazing projects.
            </p>
          </div>

          {/* Features */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 py-8">
            <div className="glass-card p-8 hover:scale-105 transition-transform">
              <h3 className="font-bold text-xl mb-3" style={{ color: 'var(--accent)' }}>
                Find Opportunities
              </h3>
              <p className="text-sm" style={{ color: 'var(--foreground-muted)' }}>
                Browse projects, internships, and collaborations posted by fellow students
              </p>
            </div>
            <div className="glass-card p-8 hover:scale-105 transition-transform">
              <h3 className="font-bold text-xl mb-3" style={{ color: 'var(--accent)' }}>
                Post Your Ideas
              </h3>
              <p className="text-sm" style={{ color: 'var(--foreground-muted)' }}>
                Have a project? Find talented collaborators who match your vision
              </p>
            </div>
            <div className="glass-card p-8 hover:scale-105 transition-transform">
              <h3 className="font-bold text-xl mb-3" style={{ color: 'var(--accent)' }}>
                Smart Matching
              </h3>
              <p className="text-sm" style={{ color: 'var(--foreground-muted)' }}>
                AI-powered recommendations based on skills and interests
              </p>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <Link
              href="/signup"
              className="btn-gradient px-10 py-4 text-lg font-semibold inline-flex items-center justify-center"
            >
              Get Started Free
            </Link>
            <Link
              href="/login"
              className="glass-card px-10 py-4 text-lg font-semibold inline-flex items-center justify-center hover:scale-105 transition-transform"
            >
              Sign In
            </Link>
          </div>

          {/* How It Works */}
          <div className="pt-12" style={{ borderTop: '1px solid var(--border)' }}>
            <h2 className="text-3xl font-bold mb-8" style={{ color: 'var(--foreground)' }}>
              How It Works
            </h2>
            <div className="grid md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold mb-3" style={{ color: 'var(--accent)' }}>01</div>
                <h4 className="font-semibold mb-2" style={{ color: 'var(--foreground)' }}>Sign Up</h4>
                <p className="text-sm" style={{ color: 'var(--foreground-muted)' }}>Create your account</p>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold mb-3" style={{ color: 'var(--accent)' }}>02</div>
                <h4 className="font-semibold mb-2" style={{ color: 'var(--foreground)' }}>Build Profile</h4>
                <p className="text-sm" style={{ color: 'var(--foreground-muted)' }}>Add skills & interests</p>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold mb-3" style={{ color: 'var(--accent)' }}>03</div>
                <h4 className="font-semibold mb-2" style={{ color: 'var(--foreground)' }}>Connect</h4>
                <p className="text-sm" style={{ color: 'var(--foreground-muted)' }}>Find opportunities</p>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold mb-3" style={{ color: 'var(--accent)' }}>04</div>
                <h4 className="font-semibold mb-2" style={{ color: 'var(--foreground)' }}>Collaborate</h4>
                <p className="text-sm" style={{ color: 'var(--foreground-muted)' }}>Build amazing projects</p>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="pt-12">
            <p className="text-sm" style={{ color: 'var(--foreground-muted)' }}>
              Built for university students • Connecting talent across campus
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
