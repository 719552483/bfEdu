package com.beifen.edu.administration.dao;

import com.beifen.edu.administration.PO.LocalUsedPO;
import com.beifen.edu.administration.domian.Edu501;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;


@Configuration
public interface Edu501Dao extends JpaRepository<Edu501, Long>, JpaSpecificationExecutor<Edu501> {

    // 根据id删除教室
    @Transactional
    @Modifying
    @Query(value = "delete from edu501 where Edu501_ID =?1", nativeQuery = true)
    void removeSite(String edu500id);

    //根据教学点查询教学任务点
    @Query(value = "select * from Edu501 where Edu500ID =?1", nativeQuery = true)
    List<Edu501> findAllByEdu501Id(String edu500Id);

    @Query(value = "select new com.beifen.edu.administration.PO.LocalUsedPO(f.edu501Id,e.city,e.cityCode,e.localName,e.localAddress, f.capacity, f.pointName,f.remarks) " +
            "from Edu500 e, Edu501 f where e.edu500Id = f.edu500Id and f.edu501Id in ?1")
    List<LocalUsedPO> findLocalUsedPOBy501Ids(List<Long> edu501Ids);
}
