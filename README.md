# k8s_devops

## DBaaS vs DIY

| **Aspect**             | **Fully Managed (DBaaS)**                                               | **Self-Managed with PVCs**                                                                   |
|------------------------|-------------------------------------------------------------------------|----------------------------------------------------------------------------------------------|
| **Initial Setup**      | Quick to launch; minimal configuration required                         | More hands-on: you handle container images, networking and volume provisioning               |
| **Maintenance**        | Patches, updates, and security largely handled by provider              | Full responsibility for upgrades, patches, monitoring and security                           |
| **Costs**              | Tends to have higher ongoing fees due to convenience and support        | Potentially cheaper infrastructure costs but more internal labor and expertise needed        |
| **Scaling**            | Simple scaling (vertical or horizontal), often auto-managed             | Must plan or script scaling; high availability needs Kubernetes and database-specific setups |
| **Backups & Restores** | Typically automated or one-click; straightforward point-in-time restore | Requires custom backup schedules, tooling and manual restores                                |
| **Level of Control**   | Somewhat limited: you’re bound by the service provider’s configuration  | Full freedom to tweak OS, tuning parameters and database engine versions                     |

---

## Summary

Fully managed databases offer minimal setup effort, automatic backups, effortless scaling and reliable high
availability. They do, however, lock you into specific configurations and can be costly over time.

On the other hand, running a database with PersistentVolumeClaims in Kubernetes gives you the power to fine-tune every
detail. Storage costs may be lower, and you avoid certain types of vendor lock-in. But with total control comes total
responsibility, you need to handle updates, secure the system, manage scaling and create your own backup strategy.

If you have limited resources or want worry-free management, a DBaaS is often the simpler choice. If you have a solid
DevOps background, need advanced customizations or seek potential cost savings on storage, DIY with PVCs could be more
appealing.
