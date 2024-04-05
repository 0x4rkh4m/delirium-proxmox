import { HttpService } from '@nestjs/axios';
import { Connection } from '../common/model/connection.model';
import { CookiesPVE } from '../common/model/cookie-pve.model';
import { NetModel } from './model/net.model';
import { ScsiModel } from './model/scsi.model';
import { IdeModel } from './model/ide.model';
import { IpModel } from './model/ip.model';
import { UserModel } from './model/user.model';
import { CpuModel } from './model/cpu.model';
import { VmsResponse } from './dto/vms-response.dto';
import { firstValueFrom } from 'rxjs';
import { CreateVMException } from './exception/vm-error-create.exception';
import { AuthFailedException } from '../common/exception/auth-failed.exception';
import { HostUnreachableException } from '../common/exception/host-unreachable.exception';
import { VmResponse } from './dto/vm-response.dto';

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
        agent,
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
        throw new CreateVMException();
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
