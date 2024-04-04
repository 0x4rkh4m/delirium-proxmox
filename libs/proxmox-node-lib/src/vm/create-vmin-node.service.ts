import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { Connection } from '@delirium/proxmox-node-lib/common/model/connection.model';
import { CookiesPVE } from '@delirium/proxmox-node-lib/common/model/cookie-pve.model';
import { VmsResponse } from '@delirium/proxmox-node-lib/vm/dto/vms-response.dto';
import { NetModel } from '@delirium/proxmox-node-lib/vm/model/net.model';
import { ScsiModel } from '@delirium/proxmox-node-lib/vm/model/scsi.model';
import { IdeModel } from '@delirium/proxmox-node-lib/vm/model/ide.model';
import { IpModel } from '@delirium/proxmox-node-lib/vm/model/ip.model';
import { UserModel } from '@delirium/proxmox-node-lib/vm/model/user.model';
import { CpuModel } from '@delirium/proxmox-node-lib/vm/model/cpu.model';
import { VmResponse } from '@delirium/proxmox-node-lib/vm/dto/vm-response.dto';
import { AuthFailedException } from '@delirium/proxmox-node-lib/common/exception/auth-failed.exception';
import { HostUnreachableException } from '@delirium/proxmox-node-lib/common/exception/host-unreachable.exception';

export class CreateVMinNodeService {
  constructor(
    private httpService: HttpService,
    private connection: Connection,
    private cookiesPVE: CookiesPVE,
  ) {}

  async createVM(
    node: string,
    vmid: number,
    cores?: number,
    name?: string,
    net?: NetModel,
    onBoot?: boolean,
    scsihw?: string,
    scsi?: ScsiModel,
    tags?: string,
    ide?: IdeModel,
    boot?: string,
    bootDisk?: string,
    agent?: string,
    ip?: IpModel,
    userModel?: UserModel,
    cpuModel?: CpuModel,
  ): Promise<VmsResponse | null> {
    try {
      const body = {
        vmid,
        cores,
        name,
        [`net${net.getIndex()}`]: net.toString(),
        onboot: onBoot,
        scsihw,
        [`scsi${scsi.getIndex()}`]: scsi.toString(),
        tags,
        [`ide${ide.getIndex()}`]: ide.getFile(),
        boot,
        bootdisk: bootDisk,
        ipconfig: ip.toString(),
        ciuser: userModel.getUserName(),
        cipassword: userModel.getPassword(),
        cpu: cpuModel.getCpuTypes(),
        memory: cpuModel.getMemory(),
        balloon: cpuModel.getBallon(),
      };

      const result = await firstValueFrom(
        this.httpService.post(
          `${this.connection.getUri()}/nodes/${node}/qemu/`,
          body,
          {
            headers: {
              'Content-Type': 'application/json',
              Accept: 'application/json',
              Cookie: await this.cookiesPVE.getCookiesAsString(
                this.connection.getUri(),
              ),
            },
          },
        ),
      );

      if (!result.data) {
        throw new Error('Error in create VM');
      }

      const vms = result.data.map(this.toResponse);

      return new VmsResponse(vms);
    } catch (error) {
      if (error.response.status === 401) {
        throw new AuthFailedException();
      }
      if (error.response.status === 0) {
        throw new HostUnreachableException();
      }
    }

    return null;
  }

  private toResponse(result: any): VmResponse {
    return new VmResponse(result[0]);
  }
}
