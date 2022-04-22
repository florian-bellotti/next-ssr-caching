const fetchGithubRepo = (organization, name) =>
    fetch(`https://api.github.com/repos/${organization}/${name}`).then(
        (response) => {
            if (!response.ok) {
                throw new Error(response.statusText);
            }
            return response.json();
        }
    );

const fetchGithubRateLimit = () =>
    fetch(`https://api.github.com/rate_limit`).then(
        (response) => {
            if (!response.ok) {
                throw new Error(response.statusText);
            }
            return response.json();
        }
    );

export default function Index({time, githubRepos, rateLimit, used}) {
    return (
        <main>
            <h1>SSR Caching with Next.js</h1>
            <time dateTime={time}>{time}</time>
            <p>rate limit: {rateLimit}</p>
            <p>rate limit used: {used}</p>
            {githubRepos.map((repo) => (
                <div key={repo.id}>
                    <p>{repo.name}</p>
                    <p>{repo.html_url}</p>
                    <div>
                        <p>{repo.subscribers_count}</p>
                        <p>{repo.forks_count}</p>
                        <p>{repo.stargazers_count}</p>
                    </div>
                </div>
            ))}
        </main>
    )
}

const repos = [
    {organization: "0xs34n", name: "starknet.js"},
    {organization: "0xs34n", name: "starknet.js"},
];

export async function getServerSideProps({req, res}) {
    res.setHeader(
        'Cache-Control',
        'public, s-maxage=10, stale-while-revalidate=59'
    )

    const githubRepos = await Promise.all(
        repos.map((repo) => fetchGithubRepo(repo.organization, repo.name)))
    const githubRateLimit = await fetchGithubRateLimit()
    return {
        props: {
            time: new Date().toISOString(),
            githubRepos,
            rateLimit: githubRateLimit.rate.limit,
            used: githubRateLimit.rate.used
        },
    }
}
