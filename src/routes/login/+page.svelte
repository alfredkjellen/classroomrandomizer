<div class="flex justify-center items-center min-h-screen">
<div class="flex flex-col gap-4 rounded-box bg-base-200 p-6 w-2/5">
    <h1 class="text-3xl font-bold self-center">Log in</h1>

    <span class="self-center">
        Don't have an account?
        <a href="/createaccount" class="link link-accent">Register</a>
    </span>

    <a href="/" class="btn btn-neutral">
        <i class="fa-brands fa-google text-primary"></i>
        Log in with Google
    </a>

    <div class="divider">OR</div>

    <label class="form-control">
        <div class="label">
            <span class="label-text">Email</span>
        </div>

        <input class="input input-bordered" />
    </label>

    <label class="form-control">
        <div class="label">
            <span class="label-text">Password</span>
            <a href="/forgotpassword" class="label-text link link-accent">Forgot password?</a>
        </div>

        <input type="password" class="input input-bordered" />
    </label>

    <div class="form-control">
        <label class="cursor-pointer label self-start gap-2">
            <input type="checkbox" class="checkbox" />
            <span class="label-text">Remember me</span>
        </label>
    </div>

    <button class="btn btn-primary">Log in</button>
</div>
</div>


