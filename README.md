# pi-clear-command

A [pi](https://github.com/earendil-works/pi) extension that adds the `/clear` command.

`/clear` removes the active conversation context without deleting the session history by jumping to the very first message of the session. You can open the previous history with `/tree`.

## Install

### Global installation

Install the extension for all projects:

```bash
mkdir -p ~/.pi/agent/extensions
curl -fsSL https://raw.githubusercontent.com/MartinKei/pi-clear-command/main/clear.ts \
  -o ~/.pi/agent/extensions/clear.ts
```

Start pi again, or run `/reload` in an active pi session.

### Project installation

Install the extension for one project:

```bash
mkdir -p .pi/extensions
cp /path/to/pi-clear-command/clear.ts .pi/extensions/clear.ts
```

Pi loads project extensions after you trust the project.

### Temporary use

Run the extension without installation:

```bash
pi -e ./clear.ts
```

## Use

Enter this command when pi is idle:

```text
/clear
```

The command performs these actions:

1. It moves the active session branch to a point with empty conversation context.
2. It does not create a summary of the previous context.
3. It clears the editor text.
4. It keeps the previous branch available in `/tree`.

The command does not accept arguments. It does not run while pi processes a response.

## Development

Pi loads the TypeScript file directly. No build step is necessary.

Test a local change with this command:

```bash
pi -e ./clear.ts
```
