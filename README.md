## General information
- Scrum Master: Doltu Teodora Eliza [elizadoltuofficial@gmail.com](mailto:elizadoltuofficial@gmail.com)
- Members: Pipirig Rares [rarespipirig@gmail.com](rarespipirig@gmail.com), Cotin Mihai [cotinmihai@gmail.com](cotinmihai@gmail.com), Karp Andrei [andreikarp977@gmail.com](andreikarp977@gmail.com), Aldea Andrei [aldea.andrei.977@gmail.com](aldea.andrei.977@gmail.com)

## Important Links
- JIRA: [NexusFS Board](https://aset-project.atlassian.net/jira/software/projects/NEXUS/boards/1)
- Confluence: [NexusFS Overview](https://aset-project.atlassian.net/wiki/x/IAEB)

## Idea

Create a universal file system API that abstracts away the differences between various file systems (local, cloud, network, etc.) and provides a consistent interface for the canonical file and directory operations (open, read, write, delete, list, etc.).

The library providing this API should allow plugins, so different file-systems can be supported without
changing the core library. The core library should provide a way to register and manage these plugins. (maybe also plugin "store"/repo?)

## LLM Agent Integration

This library can be incorporated into an MCP (model context protocol) server allowing LLM agents to touch files in a consistent manner regardless of the underlying file system. This is usefull for example if you want to have a generic instructions file for other agents, held somewhere on the network. Or if you have a large amount of files on a server you don't want to copy locally so llms can analyze them.

## Architecture

```
+--------------------------+
|    Client Application    |
| (e.g., LLM Agent / MCP   |
|       Server)            |
+------------+-------------+
             |
             | (Programmatic Calls: open, read, write, list...)
             V
+--------------------------+
|  Universal File System   |
|         API              |
|   (Core Library/SDK)     |
| (Request Validation,     |
|   Generic Error Handling)|
+------------+-------------+
             |
             | (Internal Dispatch/Routing)
             V
+--------------------------+
|    Plugin Manager /      |
|     Registry             |
| (Loads, Manages Plugins) |
+------------+-------------+
             |
   +---------+----------+---------+
   |         |          |         |
   V         V          V         V
+--------+  +-------+  +------+  +--------+
| Local  |  |Cloud  |  |Network| | Other  |
| FS     |  |Storage|  |Share  | | Custom |
| Plugin |  |(S3/GCS)  |(SMB/  | | Plugins|
| e.g.:  |  |Plugin)|  |NFS)   | |        |
|java.io |  |       |  |Plugin | |        |
+--------+  +-------+  +-------+  +-------+
   |         |          |         |
   V         V          V         V
+------------------------------------+
|     Underlying Storage Systems     |
| (Local Disk, S3 Buckets, Network NAS,|
|    SFTP Servers, HDFS, etc.)       |
+------------------------------------+
```
